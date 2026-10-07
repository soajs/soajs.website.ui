---
title: Go gateway (preview)
description: A Go implementation of the SOAJS gateway. Preview, not yet publicly released, and not at feature parity with the Node.js gateway.
sidebar:
  order: 3
  badge:
    text: Preview
    variant: caution
---

:::caution[Preview]
The Go gateway is a preview. It is not yet publicly released, and it does not implement several features of the Node.js gateway (`soajs.controller`) listed below. Use the Node.js gateway for production.
:::

The Go gateway is a rewrite of `soajs.controller` in Go (Go 1.26+, MongoDB 5.0+). It reads the same core database (registry, custom registry, tenants, keys, packages, tokens), exposes the same URL scheme (`/<service>/<path>`, `/<service>/v<N>/<path>`), the same built-in routes (`/soajs/acl`, `/soajs/proxy`), and the same maintenance routes.

## Build and run

```bash
go build -o controller ./cmd/controller
SOAJS_ENV=dev SOAJS_MONGO_URI="mongodb://<mongo-host>:27017" ./controller
```

The Makefile also has `build`, `build-linux`, `docker`, `test`, `test-coverage` and `lint` targets.

## Configuration

Configuration comes from `configs/default.yaml` and from environment variables with the `SOAJS_` prefix (nested keys use `_`).

| Variable | Default | Description |
|---|---|---|
| `SOAJS_ENV` | `dev` | Environment code. |
| `SOAJS_SERVICE_PORT` | `4000` | Gateway data port. |
| `SOAJS_MONGO_URI` | `mongodb://localhost:27017` | MongoDB connection URI. |
| `SOAJS_MONGO_DATABASE` | `core_provision` | Core provisioning database. |
| `SOAJS_LOG_LEVEL` | `info` | `debug`, `info`, `warn` or `error`. |
| `SOAJS_DEPLOY_HA` | unset | Any value enables HA (Kubernetes) awareness. |

The maintenance port is the controller port plus `serviceConfig.ports.maintenanceInc` from the environment registry, as in the Node.js gateway. If the registry does not provide them, it falls back to the data port plus `1001`.

| Maintenance route | Description |
|---|---|
| `GET /heartbeat` | Health check. |
| `GET /loadProvision` | Reload provisioning data. |
| `GET /reloadRegistry` | Reload the registry. |
| `GET /getRegistry` | Registry for a service. |
| `GET /awarenessStat` | Awareness state. |
| `GET`, `POST /register` | Register a service host. |

## Pipeline

```
context → cors → favicon → response → enhancer → ip2ban → maintenanceMode → url
→ awareness → awarenessEnv → key → keyACL → gotoService → mt → /soajs route setup
→ oauth → userACL → /soajs routes → traffic → lastSeen → monitor → proxy
```

Note that the project README lists a slightly different order (oauth before mt); the order above is the one wired in `internal/server/controller.go`.

## Differences from the Node.js gateway

Not implemented in the Go gateway:

| Feature | Node.js gateway | Go gateway |
|---|---|---|
| [GET response caching](/docs/traffic/caching/) (`cache`) | yes | no |
| [Idempotency keys](/docs/traffic/idempotency/) (`idempotency`) | yes | no |
| [Device binding](/docs/security/device-binding/) check (`user.deviceId` vs `device-id`, error 156) | yes | no |
| [Restricted token](/docs/security/restricted-tokens/) check (`restrictedTo`, error 147) | yes | no |
| Membership resolution (`membership` in the custom registry) | yes | no |
| External key `geo` / `device` allow and deny lists | yes | no |
| Network package overrides (`networkPackages` on the key) | yes | no |
| CORS settings from the environment registry | yes | fixed defaults; `device-id` is not in the allowed headers |

Other differences:

- **Error codes.** The Go gateway defines its own codes, and several numbers mean something else than in the Node.js gateway and `soajs.core.modules` (for example `156` is "Service not found", `157` maintenance mode, `158` rate limit exceeded, `159` IP banned). Clients that branch on error codes need to account for this.
- **Rate limiting.** Implemented separately from the Node.js `traffic` middleware, with memory and MongoDB models.
- **User ACL.** Resolved in a separate `userACL` step after `oauth`.

Implemented, with the same configuration as the Node.js gateway: IP ban list, maintenance mode, key and package ACL, MT IP whitelist (`mt.whitelist`), PIN wrapper and whitelist, roaming, OAuth 2.0 and JWT token validation, throttling strategies, last-seen notifications and request monitoring.
