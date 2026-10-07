---
title: Gateway
description: The soajs.controller middleware pipeline, service awareness, and the maintenance port.
sidebar:
  order: 1
---

The gateway (`soajs.controller`, service name `controller`) is the single entry point for API traffic in an environment. It listens on the data port (4000 by default) and on a maintenance port (data port + `maintenanceInc`, 5000 by default).

## Request URL

```
/<service>/<api path>
/<service>/v<version>/<api path>
/<service>:<version>/<api path>
```

Without a version the gateway routes to the latest version of the service. A request whose first path segment is not a service in the registry gets error `130` (Unknown service).

The external key is read from the `key` header or the `key` query parameter. The access token is read from the `access_token` query parameter or the `access_token` header.

## Middleware pipeline

Requests go through these middleware, in this order (from `server/controller.js`):

| # | Middleware | What it does |
|---|---|---|
| 1 | `soajs` | Creates `req.soajs`, attaches the registry and the logger. |
| 2 | `cors` | When `serviceConfig.cors.enabled` is on in the environment registry, answers `OPTIONS` preflights with `204` and sets `Access-Control-*` headers on other requests. |
| 3 | `favicon` | Serves `/favicon.ico`. |
| 4 | `response` | Adds the response helpers (`controllerResponse`, `buildResponse`). |
| 5 | `enhancer` | Adds request helpers such as client IP and user-agent lookup. |
| 6 | `ip2ban` | Rejects client IPs listed in the custom registry with `403`. See [Rate limiting](/docs/traffic/rate-limiting/#ip-ban-list). |
| 7 | `maintenanceMode` | Returns a maintenance response for every request when maintenance mode is on (see below). |
| 8 | `url` | Parses the service name and version from the URL, moves the `key` and `access_token` into place. |
| 9 | `awareness` | Attaches service discovery (`getHost`) for the current environment. |
| 10 | `awarenessEnv` | Attaches discovery for other environments, used by proxy routes. |
| 11 | `key` | Loads the external key from the provisioning data: tenant, application, package. Rejects keys for another environment (`144`). |
| 12 | `keyACL` | Resolves the ACL of the requested service from the application or the package. |
| 13 | `gotoService` | Validates the target service and version and prepares the proxy call. |
| 14 | `mt` | Multi-tenant security: IP whitelist, key geo and device restrictions, ACL, OAuth (the `oauth` middleware runs from here), URAC user and user ACL, service and API checks. Builds the `soajsinjectobj` header. |
| 15 | `idempotency` | `Idempotency-Key` handling for configured write APIs. See [Idempotency](/docs/traffic/idempotency/). |
| 16 | `traffic` | Rate limiting. See [Rate limiting](/docs/traffic/rate-limiting/). |
| 17 | `cache` | GET response caching for configured APIs. See [Caching](/docs/traffic/caching/). |
| 18 | `lastSeen` | When enabled, notifies a service (URAC by default) of user activity. |
| 19 | proxy | Forwards the request to a healthy host of the service and streams the response back. |

The provisioning data (tenants, keys, packages) is loaded before middleware 9 to 18 are added, so the gateway does not serve traffic past `url` until it has loaded.

### What the service receives

After `mt`, the gateway forwards the request with a `soajsinjectobj` header containing the tenant (`id`, `code`, `name`, `type`, optional `profile`), the key (`iKey`, `eKey`, and the key configuration for this service), the application (`product`, `package`, `appId`), the device and geo information, the awareness host and port, any `interConnect` hosts, and, when the service has `urac: true` and a user is logged in, the user. The `soajs` framework and the SDKs decode this header into `req.soajs`.

## Service awareness

The gateway builds its routing table from the environment registry and the catalog of services in the core database.

- **Without `SOAJS_DEPLOY_HA`** (custom mode): each service registers its host with the gateway's maintenance `/register` route when it starts. The gateway keeps a host list per service and version, health-checks them, and picks a healthy host per request.
- **With `SOAJS_DEPLOY_HA=kubernetes`**: hosts are resolved through Kubernetes services; the cluster does the load balancing.

Services declared with `interConnect` receive the hosts of the listed services in `soajsinjectobj`, so they can call each other directly instead of going back through the gateway.

## Maintenance mode

Turn the whole gateway into maintenance mode from the custom registry entry `gateway`:

```json
{
  "maintenanceMode": {
    "on": true,
    "status": 503,
    "message": "Maintenance in progress",
    "retryAfter": 3600
  }
}
```

| Key | Default | Description |
|---|---|---|
| `on` | off | Enables maintenance mode. |
| `status` | `503` | HTTP status returned. |
| `message` | `"Maintenance mode is on, come back soon"` | Message returned. |
| `retryAfter` | none | Value of the `Retry-After` header, in seconds. |

The check runs before any key or service lookup, so it applies to every route.

## Maintenance port

The maintenance server listens on the data port plus `serviceConfig.ports.maintenanceInc` from the environment registry (4000 + 1000 = 5000 in the default environment). Keep it internal to the cluster.

| Route | Purpose |
|---|---|
| `GET /heartbeat` | Liveness and readiness check. |
| `GET /reloadRegistry` | Reloads the environment registry. |
| `GET /loadProvision` | Reloads tenants, keys and packages. |
| `GET /awarenessStat` | Returns the awareness state (hosts and health) of the services. |
| `/register` | Used by services to register their host (custom mode only). |
| `GET /getRegistry` | Returns the registry for a service. This is the address services use as `SOAJS_REGISTRY_API`. |

Every SOAJS service has its own maintenance port with at least `/heartbeat`, `/reloadRegistry` and `/loadProvision`.

## Built-in gateway routes

| Route | Description |
|---|---|
| `/soajs/acl` | Returns the ACL for the calling key (and user, when an `access_token` is sent). |
| `/soajs/proxy?proxyRoute=<encoded route>` | Proxies the call to a service route, optionally in another environment (`__env`). |

## Configuration sources

The gateway reads its configuration from three places:

| Source | Where | Examples |
|---|---|---|
| Environment registry | `services.config` of the environment record (`registry.serviceConfig`) | `ports`, `cors`, `oauth`, `throttling` strategies, `awareness` |
| Custom registry | the custom registry entry named `gateway` (`registry.custom.gateway.value`) | `maintenanceMode`, `traffic`, `cache`, `idempotency`, `mt.whitelist`, `lastSeen`, `oauth.deviceIdCheck` |
| Tenant key configuration | the key's `config`, exposed to services as `servicesConfig` | per-service configuration, `gateway.throttling` overrides |
