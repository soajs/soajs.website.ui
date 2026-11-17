---
title: Routes
description: The routes the gateway answers itself, on the gateway port (/soajs/acl, /soajs/mcp, /soajs/proxy) and on the maintenance port.
sidebar:
  order: 5
---

Every request on the gateway port whose path starts with a service name goes to that service. See [Request URL](/docs/concepts/gateway/#request-url). The routes on this page are answered by the gateway itself.

## Gateway port

| Route | Method | Description |
|---|---|---|
| [`/soajs/acl`](#soajsacl) | any | The ACL of the calling key and user. |
| [`/soajs/mcp`](#soajsmcp) | `POST` | The MCP endpoint for AI agents. Off unless enabled. |
| [`/soajs/proxy`](#soajsproxy) | any | Forwards a call to a URL, or to the gateway of another environment. |
| `/.well-known/oauth-protected-resource`, `/.well-known/oauth-authorization-server/...` | `GET` | MCP sign-in discovery documents, when `mcp.auth` is set. |
| `/favicon.ico` | `GET` | The favicon. |

### `/soajs/acl`

Returns what the caller may call. Front ends use it to show only the screens a user can reach.

Send the external key in the `key` header; without it the gateway answers `132`. Send an `access_token` to get the user's ACL instead of the package's.

```bash
curl -H "key: <external key>" "http://localhost:4000/soajs/acl?access_token=<token>"
```

```json
{
  "acl": {"orders": {"1": {"access": true, "apisPermission": "restricted", "get": {"apis": {"/orders": {}}}}}},
  "finalACL": {"orders": {"version": "1", "get": ["/orders"]}},
  "packages": ["SHOP_USER"],
  "urac": {"_id": "<user id>"},
  "tenant": {"id": "<tenant id>", "name": "Shop", "code": "SHOP", "type": "product"}
}
```

The answer is the object itself, not wrapped in `result` and `data`.

| Field | Description |
|---|---|
| `acl` | The ACL as stored: from the user's packages with a token, else from the key's package. |
| `finalACL` | Per service, the latest version the caller may use and, for restricted services, the allowed APIs per method. |
| `packages` | The packages the ACL was built from. |
| `urac` | The user's `_id`, with a token. |
| `tenant` | The key's tenant. |

The key, OAuth and user checks run as for any call. The route has no ACL of its own.

### `/soajs/mcp`

The [MCP](https://modelcontextprotocol.io) endpoint. AI agents see the APIs their caller may use as tools, and a tool call is processed as the API call it stands for. It answers `404` until `mcp.enabled` is `true` in the custom registry.

See [MCP for AI agents](/docs/concepts/mcp/) and the [`mcp` key](/docs/gateway/custom-registry/#mcp).

### `/soajs/proxy`

Forwards the request to the route given in the `proxyRoute` query parameter, URL-encoded. The method, headers and body are forwarded, and the answer is streamed back.

| Parameter | Required | Description |
|---|---|---|
| `proxyRoute` | yes | Without `__env`: a full URL. With `__env`: a gateway route, `/<service>/<path>`. |
| `__env` | no | Code of another environment. Also read from the `__env` header. |
| `extKey` | no | External key to use in that environment. |
| `tCode` | no | Code of a tenant. The gateway uses the tenant's key for that environment. Defaults to the calling key's tenant. |

With `__env`, the gateway loads the other environment's registry and sends the call to its public address, `protocol://[apiPrefix.]domain:port` from the [environment record](/docs/gateway/environment-registry/#other-fields). The key is the first of:

1. `extKey`, when given;
2. the key of `tCode`'s tenant for that environment, with dashboard access;
3. none.

```bash
curl -H "key: <external key>" \
  "http://localhost:4000/soajs/proxy?__env=STG&proxyRoute=%2Forders%2Forders"
```

The external key is optional on this route. When it is sent, it is checked as for any call. The ACL and OAuth checks do not run here. The gateway of the other environment runs them.

`/proxy/redirect` is the older name of this route. The Node.js gateway still answers it and logs that it is deprecated. The Go gateway does not.

| Code | Meaning |
|---|---|
| `135` | The call failed, or `proxyRoute` is not a valid URL. |
| `139` | No tenant found for `tCode`. |
| `207` | The other environment has no registry. |
| `208` | The other environment has no `protocol`, `domain` or `port`. |

## Maintenance port

The maintenance server listens on the gateway port plus `serviceConfig.ports.maintenanceInc` (5000 by default). Keep it inside the cluster: it has no key or token check.

| Route | Method | Description |
|---|---|---|
| `/heartbeat` | `GET` | Answers when the gateway is up. Use it as the liveness and readiness probe. Any path not listed here answers the same. |
| `/reloadRegistry` | `GET` | Reloads the environment registry and the custom registry. |
| `/loadProvision` | `GET` | Reloads tenants, keys and packages. |
| `/awarenessStat` | `GET` | The services the gateway knows, with their hosts and health. |
| `/getRegistry` | `GET` | The registry of one service. Services call it at startup, at the address they get in `SOAJS_REGISTRY_API`. |
| `/register` | `POST` | A service registers its host. Used without `SOAJS_DEPLOY_HA` only. |
| `/cache/invalidate` | `POST` | Removes cached GET answers a service knows are out of date. Needs the mongo cache model. |
| `/schemaProblems` | `GET` | Go gateway 4.4.32+ only. The problems found in the data the gateway read: collection, document `_id`, location, rule and what the gateway did (read as Node.js, left out a piece, skipped the document, fell back to the key's package). Locations only, never values. `?collection=` filters. See [How Go reads imperfect data](https://github.com/soajs/soajs.controller.go/blob/main/docs/data-schema/imperfect-data.md). |

### `/getRegistry`

| Parameter | Description |
|---|---|
| `env` | Environment code. |
| `serviceName` | The service asking. |
| `type` | `service` (default), `daemon` or `mdaemon`. |

The answer holds the environment's public address, its `serviceConfig` without `cors` (and without `oauth`, except for the `oauth` service), the core databases, the custom registry, the resources, the gateway's entry and the asking service's own entry.

### `/cache/invalidate`

```bash
curl -X POST http://localhost:5000/cache/invalidate \
  -H "Content-Type: application/json" \
  -d '{"tenant": "<tenant id>", "service": "catalog", "api": "GET /products"}'
```

The answer gives the number of entries removed. See [Invalidation](/docs/traffic/caching/#invalidation) for the fields.

### Reload after a change

Changes made in the console reach the gateway on the next registry load. To apply them at once, call each gateway instance:

```bash
curl http://<gateway pod>:5000/reloadRegistry   # environment record, custom registry
curl http://<gateway pod>:5000/loadProvision    # tenants, keys, packages
```

## Every service's maintenance port

Each SOAJS service has its own maintenance port, with at least `/heartbeat`, `/reloadRegistry` and `/loadProvision`. From `soajs` 4.1.24 it also has `/mcp/tools`, which describes its APIs for the MCP endpoint. Which port that is depends on the environment and how the service runs: see [Service ports](/docs/concepts/gateway/#service-ports).
