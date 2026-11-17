---
title: Node.js and Go
description: What the Go gateway leaves out or does differently from the Node.js gateway, and what to check before you move an environment to it.
sidebar:
  order: 6
---

The Go gateway answers as the Node.js gateway 4.3.30 does. A conformance harness checks it on 129 requests, and on the call events both write. The differences below are deliberate. The full list, with the pull request for each, is in the repository's [differences](https://github.com/soajs/soajs.controller.go/blob/main/docs/differences.md).

## Before you switch

Check these in the environment you move:

1. **Latest data schema.** The Go gateway reads only the current shape of each collection. A document that does not match is logged, then skipped or refused, never converted. Fields the gateway does not read are ignored (4.4.31+), so your services can keep their own fields in user and group records. Run `schemacheck` from the repository against your databases first. The schema of each collection is in its [data-schema](https://github.com/soajs/soajs.controller.go/tree/main/docs/data-schema) folder.
2. **urac `masterDB`.** The custom registry `urac` entry must set `masterDB`, the core database that holds users and groups. The Go gateway reads users only there. Without it, calls that need the user answer `146`.
3. **Booleans are booleans.** Settings such as `cors.credentials` must be stored as `true` or `false`, not as text. A document with text in a boolean field does not match its schema.
4. **The `gateway` custom registry entry.** It is checked as a whole. One unknown key or wrong type and the whole entry is skipped, so every feature in it is off. `lastSeen` needs `include`, in the method-list form. See [Custom registry](/docs/gateway/custom-registry/#lastseen).
5. **The gateway port.** The Go gateway listens on `SOAJS_SERVICE_PORT` (4000), not on `serviceConfig.ports.controller`. Set it if your registry uses another port. See [Ports](/docs/gateway/run/#ports).
6. **Nothing below is in use.** Check that no service or client relies on a feature listed under Not ported.

You can run both gateways against the same environment and move traffic one instance at a time.

## Not ported

| Feature | What to use instead |
|---|---|
| JWT access tokens (oauth `type` 0) | Stored access tokens (oauth `type` 2), the default. |
| Endpoint-type services (`src.url`, `src.urls`, a key's `config.<service>.url`, API builder) | Register the service as a SOAJS service, or put it behind one. |
| `/proxy/redirect` | `/soajs/proxy`, its current name. |
| `/proxySocket/*` on the maintenance port | None. |
| `GET /register` | `POST /register`. |
| `?name=` on `/getRegistry` | `?serviceName=`. |
| Per-tenant urac databases | `masterDB` in the `urac` entry. |
| Older data shapes: application-level ACLs, flat `apis` lists, ACLs without a version, `access` as a list of groups, `dbs.clusters`, `custom` inside the environment record, the old deployer shape, hosts without `version`, a catalog `maintenance.port.type` other than `maintenance` or `inherit` with a numeric `port.value` | The current shapes the console writes. |
| `SOAJS_SOLO`, `SOAJS_MONGO_CON_KEEPALIVE` | Not needed: the Go gateway always reads MongoDB and keeps its connections open. |

## Configured differently

| | Node.js | Go |
|---|---|---|
| Logging | `serviceConfig.logger` in the registry | `SOAJS_LOG_LEVEL` and `SOAJS_LOG_FORMAT` |
| Gateway port | `serviceConfig.ports.controller` | `SOAJS_SERVICE_PORT` |
| Settings file | none | optional `config.yaml` |
| Invalid custom registry entry | read as found | skipped as a whole, and logged |

## Behaviour

**Registry and maintenance port**

- The maintenance answers, and MCP's `serverInfo.version`, give the Go gateway's own version.
- Registry dumps never include connection-pool options.
- `/getRegistry` does not show the throttling model.
- `/register` writes only the fields the registration gave. A new service without `requestTimeout` or `requestTimeoutRenewal` gets `0`.
- `?type=mdaemon` on `/getRegistry` answers for the daemon.
- JSON key order in registry dumps can differ.

**Awareness**

- With `SOAJS_DEPLOY_HA=kubernetes`, a deployer without a namespace gives no host.

**Proxy**

- Each request timeout renewal counts once.
- When awareness has no gateway host, the awareness block and the `interConnect` hosts are left out of `soajsinjectobj`.

**urac**

- The tenant access resolver call has a total timeout, not only a connection timeout.
- A tie between two main products in `membership` is broken by name.
- A requested version absent from the user's ACL answers `154`.

**Gateway routes**

- `/soajs/acl` sorts the object keys and the API lists in `finalACL`; the content is the same as the Node.js gateway's.
- `/soajs/proxy` answers `139` for an invalid `%` escape in `proxyRoute`.
- `/soajs/mcp` returns Go's error text for a tool call that fails on the network, and does not use an `operationId` that is not a string in a tool name.

**Idempotency and cache**

- With the mongo model, the idempotency lock is taken in one atomic operation, so two requests cannot both take it.
- When the client disconnects before the answer ends, the service's full answer is still recorded for idempotency and stored in the cache.
- A replayed or cached answer is sent without its hop-by-hop headers.
- When several `:param` cache entries match a path, the first in sorted order wins. An exact entry always wins.
