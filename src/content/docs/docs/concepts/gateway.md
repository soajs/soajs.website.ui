---
title: Gateway
description: The soajs.controller middleware pipeline, service awareness, and the maintenance port.
sidebar:
  order: 1
---

The gateway (service name `controller`) is the single entry point for API traffic in an environment. It listens on the data port (4000 by default) and on a maintenance port (data port + `maintenanceInc`, 5000 by default). It comes in two builds that answer the same way: Node.js (`soajs.controller`) and Go (`soajs.controller.go`).

This page explains how the gateway works. To run and configure it, see the [Gateway](/docs/gateway/overview/) section.

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
| 8 | MCP discovery | Serves the `/.well-known/oauth-*` documents of the MCP sign-in, when `mcp.auth` is set. See [MCP for AI agents](/docs/concepts/mcp/). |
| 9 | `url` | Parses the service name and version from the URL, moves the `key` and `access_token` into place. |
| 10 | `awareness` | Attaches service discovery (`getHost`) for the current environment. |
| 11 | `awarenessEnv` | Attaches discovery for other environments, used by proxy routes. |
| 12 | MCP authorize | For `/soajs/mcp` with MCP sign-in on: answers `401` without a valid token, and takes the key from a token restricted to one key. |
| 13 | `events` | Starts the [call event](/docs/traffic/call-events/) of the request, when call events are on. The event is written after the answer, off the request path. |
| 14 | `key` | Loads the external key from the provisioning data: tenant, application, package. Rejects keys for another environment (`144`). |
| 15 | `keyACL` | Resolves the ACL of the requested service from the application or the package. |
| 16 | `gotoService` | Validates the target service and version and prepares the proxy call. |
| 17 | `mt` | Multi-tenant security: IP whitelist, key geo and device restrictions, ACL, OAuth (the `oauth` middleware runs from here), URAC user and user ACL, service and API checks. Builds the `soajsinjectobj` header. |
| 18 | `idempotency` | `Idempotency-Key` handling for configured write APIs. See [Idempotency](/docs/traffic/idempotency/). |
| 19 | `traffic` | Rate limiting. See [Rate limiting](/docs/traffic/rate-limiting/). |
| 20 | `cache` | GET response caching for configured APIs. See [Caching](/docs/traffic/caching/). |
| 21 | `lastSeen` | When enabled, notifies a service (URAC by default) of user activity. |
| 22 | proxy | Forwards the request to a healthy host of the service and streams the response back. |

The provisioning data (tenants, keys, packages) is loaded before middleware 9 to 18 are added, so the gateway does not serve traffic past `url` until it has loaded.

### What the service receives

After `mt`, the gateway forwards the request with a `soajsinjectobj` header containing the tenant (`id`, `code`, `name`, `type`, optional `profile`), the key (`iKey`, `eKey`, and the key configuration for this service), the application (`product`, `package`, `appId`), the device and geo information, the awareness host and port, any `interConnect` hosts, and, when the service has `urac: true` and a user is logged in, the user. The `soajs` framework and the SDKs decode this header into `req.soajs`.

## Service awareness

The gateway builds its routing table from the environment registry and the catalog of services in the core database.

- **Without `SOAJS_DEPLOY_HA`** (custom mode): each service registers its host with the gateway's maintenance `/register` route when it starts. The gateway keeps a host list per service and version, health-checks them, and picks a healthy host per request.
- **With `SOAJS_DEPLOY_HA=kubernetes`**: hosts are resolved through Kubernetes services; the cluster does the load balancing.

Services declared with `interConnect` receive the hosts of the listed services in `soajsinjectobj`, so they can call each other directly instead of going back through the gateway.

### Service ports

A service's catalog entry gives its port, for example 4001 for urac. The port it actually listens on depends on how it runs:

| Case | Data port | Maintenance port |
|---|---|---|
| `SOAJS_DEPLOY_HA` set | catalog port | catalog port + `maintenanceInc` |
| no HA, `SOAJS_SRVPORT` set | `SOAJS_SRVPORT` | `SOAJS_SRVPORT` + `maintenanceInc` |
| no HA, environment `DASHBOARD` | catalog port | catalog port + `maintenanceInc` |
| no HA, any other environment | catalog port + the environment's `ports.controller` | data port + `maintenanceInc` |

The last case lets several environments run on one machine without port clashes. With urac on 4001, `ports.controller` 4000 and `maintenanceInc` 1000, urac listens on 8001 and 9001 in `DEV`, and on 4001 and 5001 in `DASHBOARD`. The same rules apply to daemons. The gateway itself never takes the offset: it listens on `ports.controller`, with its maintenance port at `ports.controller` + `maintenanceInc`.

In custom mode the gateway learns the real port when the service registers. The service sends its catalog `port` and its real data port, `portHost`. The host record keeps `portHost`, or `port` when there is none. When the registry loads, for an environment not listed in `SOAJS_SENSITIVE_ENVS` (default `["dashboard"]`), the host's port replaces the service's port, and the catalog port is kept as `oport`.

:::caution[Keep SOAJS_SENSITIVE_ENVS aligned]
Services exempt only `DASHBOARD` from the port offset. The gateway exempts the environments in `SOAJS_SENSITIVE_ENVS`. If you add another environment to `SOAJS_SENSITIVE_ENVS` in custom mode, its services still listen on shifted ports, but the gateway keeps calling the catalog port. Leave `SOAJS_SENSITIVE_ENVS` at `["dashboard"]` unless the services of the environments you add run with `SOAJS_DEPLOY_HA`.
:::

To check a service (health checks, request-timeout renewal, fetching its MCP tools), the gateway uses the `maintenance` block of the service's catalog version:

| `maintenance.port.type` | Checked at |
|---|---|
| `maintenance` | `readiness` path on the service port + `maintenanceInc` |
| `inherit` | `readiness` path on the service port |
| no `maintenance` block | `/heartbeat` on the service port + `maintenanceInc`. The health check then tries `/heartbeat` on the service port itself. |

Gateways of other environments are checked at their `ports.controller` + `maintenanceInc`, `/heartbeat`.

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

The check runs before any key or service lookup, so it applies to every route. The keys and their defaults are in [Custom registry](/docs/gateway/custom-registry/#maintenancemode).

## Stopping the gateway

From 4.3.30, on `SIGTERM` or `SIGINT` the gateway stops cleanly:

1. The gateway and maintenance ports stop accepting connections, and idle keep-alive connections close.
2. Requests in flight finish, for at most `SOAJS_SERVER_SHUTDOWN_TIMEOUT` seconds (10 by default).
3. Cleanup runs, such as writing the call events still queued.
4. The process exits with `0`. When the timeout passes first, it exits anyway.

A second signal while stopping is ignored. In Kubernetes, keep `terminationGracePeriodSeconds` above the timeout.

## Maintenance port

The maintenance server listens on the data port plus `serviceConfig.ports.maintenanceInc` from the environment registry (4000 + 1000 = 5000 in the default environment). It answers health checks, reloads the registry and provisioning data, and lets services register and load their registry. Keep it internal to the cluster. The routes are listed in [Routes](/docs/gateway/routes/#maintenance-port).

## Built-in gateway routes

The gateway answers a few routes itself: `/soajs/acl` (the caller's ACL), `POST /soajs/mcp` ([MCP for AI agents](/docs/concepts/mcp/)) and `/soajs/proxy` (forward a call, optionally to another environment). See [Routes](/docs/gateway/routes/).

## Configuration sources

| Source | Where | Reference |
|---|---|---|
| Environment variables | the process | [Run it](/docs/gateway/run/#environment-variables) |
| Environment registry | `services.config` of the environment record (`registry.serviceConfig`) | [Environment registry](/docs/gateway/environment-registry/) |
| Custom registry | the entries named `gateway`, `oauth` and `urac` | [Custom registry](/docs/gateway/custom-registry/) |
| Tenant key configuration | the key's `config`, exposed to services as `servicesConfig` | [Key configuration](/docs/gateway/custom-registry/#key-configuration) |
