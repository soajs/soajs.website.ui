---
title: Environment registry
description: The keys of the environment record the gateway reads, under services.config and services.controller, with types and defaults.
sidebar:
  order: 3
---

Each environment has one record in the `environment` collection of the provision database. The gateway loads the record of `SOAJS_ENV` at startup, on `/reloadRegistry`, and every `awareness.autoRelaodRegistry` milliseconds. The console manages it.

Inside the gateway, `services.config` is called `serviceConfig`. Services receive it through `/getRegistry`, without `cors` and `oauth`.

Every key below is read by both gateways unless the row says otherwise.

## Ports

`services.config.ports`

| Key | Type | Default environment | Description |
|---|---|---|---|
| `controller` | integer | `4000` | Gateway port. The Node.js gateway listens on it. The Go gateway listens on `SOAJS_SERVICE_PORT` and uses this value for the maintenance port. |
| `maintenanceInc` | integer | `1000` | Added to a port to get its maintenance port, for the gateway and for every service. |
| `randomInc` | integer | `100` | Not used by the gateway. |

## Awareness

`services.config.awareness`

| Key | Type | Description |
|---|---|---|
| `healthCheckInterval` | integer, ms | How often the gateway checks the hosts of each service. |
| `autoRelaodRegistry` | integer, ms | How often the registry is reloaded. The key is spelled `autoRelaodRegistry`. |
| `maxLogCount` | integer | How many failed checks are logged per host before the gateway stops logging them. |
| `autoRegisterService` | boolean | Whether the gateway registers its own host. |
| `cacheTTL` | integer, ms | With `SOAJS_DEPLOY_HA=kubernetes`: how long the list of Kubernetes services is kept before it is read again. |

## CORS

`services.config.cors`

| Key | Type | Default when empty | Description |
|---|---|---|---|
| `enabled` | boolean | off | Turns CORS on. `OPTIONS` preflights answer `204`. |
| `origin` | string | `*` | `Access-Control-Allow-Origin`. |
| `credentials` | boolean | `true` | `Access-Control-Allow-Credentials`. Both gateways write `true` when the value is `false` or missing, as the Node.js gateway always has. The Go gateway requires a boolean, not the text `"true"`. |
| `methods` | string | `GET,HEAD,PUT,PATCH,POST,DELETE` | `Access-Control-Allow-Methods`. |
| `headers` | string | `__env,key,soajsauth,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type` | `Access-Control-Allow-Headers`. Add `access_token` and `device-id` if your clients send them. |
| `maxage` | integer, s | `1728000` | `Access-Control-Max-Age`. |

## OAuth

`services.config.oauth`

| Key | Type | Description |
|---|---|---|
| `getUserFromToken` | boolean | `true`: the user stored on the access token is the user, with no urac lookup per call. Faster, but changes to the user are seen only with a new token. |
| `accessTokenLifetime`, `refreshTokenLifetime` | integer, s | Token lifetimes. Read by `soajs.oauth` when it issues tokens. |
| `grants` | string[] | Grants `soajs.oauth` accepts, such as `password` and `refresh_token`. Not used by the Go gateway. |
| `debug` | boolean | OAuth library debug output. Not used by the Go gateway. |
| `type` | integer | `2` (default): stored access tokens. `0`: JWT access tokens, with `secret`, `algorithms` (default `["HS256"]`) and `audience`. A tenant's own `oauth.type` wins over this value. Node.js only: the Go gateway does not support JWT tokens. |

See [OAuth](/docs/security/oauth/) for the token flow.

## Throttling strategies

`services.config.throttling`

| Key | Type | Description |
|---|---|---|
| `publicAPIStrategy` | string | Strategy applied to public APIs. Empty or missing: no limit. |
| `privateAPIStrategy` | string | Strategy applied to private APIs. Empty or missing: no limit. |
| `<strategy>.type` | integer | `1`: count per tenant and client IP. Any other value: count per tenant. |
| `<strategy>.window` | integer, ms | Length of the window. |
| `<strategy>.limit` | integer | Requests allowed per window. |
| `<strategy>.retries` | integer | Times the gateway waits and checks again before answering `429`. |
| `<strategy>.delay` | integer, ms | Wait between those checks. |

Per-service overrides and the storage model are in the custom registry, [`traffic`](/docs/gateway/custom-registry/#traffic-and-ip2ban). See [Rate limiting](/docs/traffic/rate-limiting/).

## Extkey decryption

`services.config.key`

| Key | Type | Description |
|---|---|---|
| `algorithm` | string | Cipher of the external keys, such as `aes256`. |
| `password` | string | Passphrase of the external keys. Keep it secret. |

The gateway decrypts the external key with these values to find the tenant key.

## Session cookie

`services.config.session`

| Key | Type | Description |
|---|---|---|
| `name`, `secret` | string | The `soajsauth` session cookie, used when `services.controller.authorization` is on. |

The other `session` keys and `cookie` are not used by the gateway. They are passed on to services.

## Logger

`services.config.logger` sets the Node.js gateway's log level and format (`level`, `src`, `formatter`). The Go gateway logs with `SOAJS_LOG_LEVEL` and `SOAJS_LOG_FORMAT` instead.

## Gateway entry

`services.controller`

| Key | Type | Description |
|---|---|---|
| `requestTimeout` | integer, s | Time a service has to answer, for services that do not set their own. |
| `requestTimeoutRenewal` | integer | How many times the timeout is renewed for a service still sending its answer. |
| `authorization` | boolean | Turns on the `soajsauth` session cookie on proxied calls. |

A service's own `requestTimeout` and `requestTimeoutRenewal`, from its catalog entry, win over these.

## Other fields

| Field | Description |
|---|---|
| `code` | Environment code. `SOAJS_ENV` in upper case. |
| `domain`, `apiPrefix`, `port`, `protocol` | Public address of the environment's gateway: `protocol://[apiPrefix.]domain:port`. Another gateway uses it for [`/soajs/proxy`](/docs/gateway/routes/#soajsproxy) with `__env`. |
| `deployer.container.kubernetes.namespace` | With `SOAJS_DEPLOY_HA=kubernetes`, the namespace of the environment's services. |
| `dbs` | The environment's databases. The gateway uses the core databases `oauth` (access tokens, else provision) and `gateway` (throttling, idempotency and cache stores, else provision), and the urac database named by the custom registry `urac.masterDB`. |

The full schema of the record, as the Go gateway reads it, is in [environment.md](https://github.com/soajs/soajs.controller.go/blob/main/docs/data-schema/environment.md).
