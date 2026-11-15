---
title: Custom registry
description: Every key the gateway reads from the custom registry entries gateway, oauth and urac, and from a tenant key's configuration, with types, defaults and examples.
sidebar:
  order: 4
---

The custom registry holds named settings per environment, in the `custom_registry` collection of the provision database. The console manages it. The gateway reads three entries:

| Entry | Holds |
|---|---|
| `gateway` | The gateway features: maintenance mode, traffic, cache, idempotency, call events, MCP, and more. |
| `oauth` | Roaming between environments, and the PIN login routes. |
| `urac` | Where users are stored, and the tenant access resolvers. |

Every other entry belongs to your services. The gateway passes them on untouched.

An entry is loaded when it is `plugged` and was created in the environment, or is `shared` with it. Its settings are under `value`. The gateway reads the entries each time it loads the registry: at startup, on `/reloadRegistry`, and every `awareness.autoRelaodRegistry` milliseconds.

```json
{
  "name": "gateway",
  "created": "DEV",
  "plugged": true,
  "shared": false,
  "sharedEnvs": {},
  "value": {
    "maintenanceMode": {"on": false}
  }
}
```

:::caution[Go: the entry must match its schema]
The Go gateway checks each entry against its [data schema](https://github.com/soajs/soajs.controller.go/blob/main/docs/data-schema/custom_registry.md). An entry with an unknown key, a wrong type or a missing required key is logged and skipped as a whole, so every feature in it is off. The Node.js gateway reads what it finds. Run the repository's `schemacheck` against your database before you move an environment to the Go gateway.
:::

## The `gateway` entry

Every block is optional. A missing block leaves the feature off.

| Key | Turns on | Details |
|---|---|---|
| [`maintenanceMode`](#maintenancemode) | One answer for every request | below |
| [`traffic`](#traffic-and-ip2ban) | Per-service throttling, the throttling store, the IP ban list | [Rate limiting](/docs/traffic/rate-limiting/) |
| [`idempotency`](#idempotency) | `Idempotency-Key` handling for write APIs | [Idempotency keys](/docs/traffic/idempotency/) |
| [`cache`](#cache) | GET response caching | [Response caching](/docs/traffic/caching/) |
| [`events`](#events) | One call event per request | [Call events](/docs/traffic/call-events/) |
| [`mcp`](#mcp) | `POST /soajs/mcp` for AI agents, and agent sign-in | [MCP for AI agents](/docs/concepts/mcp/) |
| [`mt.whitelist`](#mtwhitelist) | Skipping the ACL or OAuth check for trusted IPs | below |
| [`oauth.deviceIdCheck`](#oauthdeviceidcheck) | Turning the device check off | [Device binding](/docs/security/device-binding/) |
| [`lastSeen`](#lastseen) | Reporting user activity | below |
| [`membership`](#membership) | The user's membership on every call | below |
| [`gotoService`](#gotoservice) | Request monitoring, and the timeout renewal switch | below |

### `maintenanceMode`

Every request gets the same answer, before any key or service lookup.

| Key | Type | Default | Description |
|---|---|---|---|
| `on` | boolean | off | Turns maintenance mode on. Required in the block for Go. |
| `status` | integer | `503` | HTTP status. |
| `message` | string | `Maintenance mode is on, come back soon` | Message in the answer. |
| `retryAfter` | integer, s | none | Value of the `Retry-After` header. |

```json
"maintenanceMode": {"on": true, "status": 503, "message": "Back at 10:00 UTC", "retryAfter": 1800}
```

### `traffic` and `ip2ban`

| Key | Type | Default | Description |
|---|---|---|---|
| `model` | string | `memory` | Throttling store: `memory` (per gateway instance) or `mongo` (shared). Required in the block for Go. |
| `ip2ban` | string[] | `[]` | Client IPs refused with `403` (`banned`). Exact IPs, no ranges. |
| `throttling.<service>.publicAPIStrategy` | string | | Strategy for the service's public APIs. |
| `throttling.<service>.privateAPIStrategy` | string | | Strategy for its private APIs. |
| `throttling.<service>.apis` | string[] | all APIs | Limits the override to these API paths. |

The strategies themselves are in the [environment registry](/docs/gateway/environment-registry/#throttling-strategies). A tenant key's `config.gateway.throttling` replaces this `throttling` block for that tenant. It is not merged with it.

```json
"traffic": {
  "model": "mongo",
  "ip2ban": ["203.0.113.7"],
  "throttling": {"orders": {"publicAPIStrategy": "strict", "apis": ["/checkout"]}}
}
```

See [Rate limiting](/docs/traffic/rate-limiting/).

### `idempotency`

| Key | Type | Default | Description |
|---|---|---|---|
| `model` | string | `memory` | `memory` or `mongo`. Required in the block for Go, with `services`. |
| `enforce` | boolean | `false` | Require the `Idempotency-Key` header on every enabled API. |
| `services.<service>.enabled` | boolean | `false` | Turns idempotency on for the service. |
| `services.<service>.enforce` | boolean | the global `enforce` | Overrides `enforce` for the service. |
| `services.<service>.ttl` | integer, ms | `60000` | How long a key is locked and its answer replayed. |
| `services.<service>.apis` | string[] | all APIs | `"METHOD /path"` entries, with `:param` segments allowed. |

```json
"idempotency": {
  "model": "mongo",
  "services": {"payments": {"enabled": true, "ttl": 86400000, "apis": ["POST /charge"]}}
}
```

See [Idempotency keys](/docs/traffic/idempotency/).

### `cache`

| Key | Type | Default | Description |
|---|---|---|---|
| `model` | string | `memory` | `memory` or `mongo`. Invalidation needs `mongo`. Required in the block for Go. |
| `defaultTTL` | integer, ms | `300000` | TTL of an API that sets none. |
| `services.<service>.enabled` | boolean | `false` | Turns caching on for the service. |
| `services.<service>.apis."GET /path".enabled` | boolean | `false` | Turns caching on for the API. |
| `services.<service>.apis."GET /path".ttl` | integer, ms | `defaultTTL` | TTL of the API. |
| `services.<service>.apis."GET /path".scope` | string | `tenant` for public APIs, `tenant_user` for private | Whether entries are shared by the tenant or kept per user. |

```json
"cache": {
  "model": "mongo",
  "defaultTTL": 300000,
  "services": {"catalog": {"enabled": true, "apis": {"GET /products": {"enabled": true, "ttl": 600000}}}}
}
```

See [Response caching](/docs/traffic/caching/).

### `events`

| Key | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | off | Turns call events on. |
| `sink` | string | | `mongo` or `log`. `log` writes each event at info level, for debugging. |
| `mongo.db` | string | | A core database of the environment, such as `gateway`. |
| `mongo.collection` | string | | The time-series collection. The gateway creates it when it is missing. |
| `queueSize` | integer | `10000` | Events waiting to be written. When full, new events are dropped and counted. |
| `services.<service>.enabled` | boolean | | With `services`, only the services enabled emit events. Without it, every service does. |

```json
"events": {"enabled": true, "sink": "mongo", "mongo": {"db": "gateway", "collection": "call_events"}}
```

See [Call events](/docs/traffic/call-events/).

### `mcp`

| Key | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | off | Turns `POST /soajs/mcp` on. Off, it answers `404`. |
| `ttl` | integer, ms | `300000` | How long the tools of a service are cached. |
| `errorTtl` | integer, ms | `30000` | How long before a service that did not answer is asked again. |
| `timeout` | integer, ms | `10000` | Time to fetch the tools of a service, and to call a tool. |
| `maxTools` | integer | `300` | Most tools in one list. |
| `auth.default`, `auth.byProduct.<product>`, `auth.byHost.<host>` | object | | Your authorization server: `authorization_endpoint` and `token_endpoint` (required), `registration_endpoint`. Turns on agent sign-in. |
| `auth.scheme` | string | the request's | `http` or `https`: scheme of the addresses the gateway gives out, when your proxy does not pass it on. |

```json
"mcp": {"enabled": true, "maxTools": 300}
```

See [MCP for AI agents](/docs/concepts/mcp/), and [Let agents sign in](/docs/concepts/mcp/#let-agents-sign-in) for `auth`.

### `mt.whitelist`

Calls from these networks skip the package ACL check, the OAuth check, or both.

| Key | Type | Default | Description |
|---|---|---|---|
| `ips` | string[] | `[]` | IPs or CIDR ranges. Required in the block for Go. |
| `acl` | boolean | `false` | Skip the ACL check for these IPs. |
| `oauth` | boolean | `false` | Skip the OAuth check for these IPs. |

```json
"mt": {"whitelist": {"ips": ["10.0.0.0/8"], "acl": false, "oauth": true}}
```

See [Whitelisting internal callers](/docs/concepts/access-control/#whitelisting-internal-callers).

### `oauth.deviceIdCheck`

| Key | Type | Default | Description |
|---|---|---|---|
| `deviceIdCheck` | boolean | on | `false` turns off the check of the token's device against the `device-id` header. Any other value leaves it on. |

```json
"oauth": {"deviceIdCheck": false}
```

This is a key of the `gateway` entry, not of the `oauth` entry. See [Device binding](/docs/security/device-binding/#turning-the-gateway-check-off).

### `lastSeen`

The gateway reports user activity to a service, URAC by default, after the call. It does not wait for the report.

| Key | Type | Default | Description |
|---|---|---|---|
| `active` | boolean | `false` | Turns reporting on. |
| `serviceName` | string | `urac` | Service that receives the report. |
| `serviceVersion` | string | `3` | Its version. |
| `api` | string | `/user/last/seen` | Its route. |
| `network` | string | | Sent in the report body. Also selects the [network package override](#key-configuration). |
| `include` | object | every request | Which calls count as activity (see below). Required for Go. |
| `targets[]` | object[] | | More routes told of the same activity: `serviceName` and `api` (required), `serviceVersion`, `method` (default `post`). |

`include` is keyed by service:

| Form | Counts |
|---|---|
| service not in `include` | never |
| `"orders": true` | every API of the service. Node.js only. |
| `"orders": {"apis": {"/checkout": true}}` | that API, every method. Node.js only. |
| `"orders": {"apis": {"/checkout": ["post"]}}` | that API, these methods |
| `"orders": {"apis": {"*": ["get"]}}` | every API, these methods |

API paths are relative to the service and may have `:param` segments. The Go schema accepts only the method-list forms, and only relative paths.

```json
"lastSeen": {
  "active": true,
  "include": {"orders": {"apis": {"/checkout": ["post"], "/order/:id": ["get"]}}}
}
```

### `membership`

Puts the user's membership name on the urac object of each call, so a service reads `req.soajs.urac.membership` without a lookup. A membership is held per main product on the user record.

| Key | Type | Default | Description |
|---|---|---|---|
| `active` | boolean | `false` | Resolve memberships at all. |
| `<MAIN PRODUCT>` | string[] | | A product memberships are held in, with the sub products that resolve to it. Any key other than `active` is read as a main product. |

```json
"membership": {"active": true, "SHOP": ["SHOPPRO", "SHOPKIDS"]}
```

Nothing is injected when the block is off, when the call's product is neither a main product nor one of its sub products, when the user holds no membership for it, or when the service does not ask for urac.

### `gotoService`

| Key | Type | Default | Description |
|---|---|---|---|
| `renewReqMonitorOff` | boolean | `false` | `true` turns off the request timeout renewal: a service gets `requestTimeout` once. |
| `monitor.whitelist` | string[] | | Only these services are monitored. Wins over `blacklist`. |
| `monitor.blacklist` | string[] | | These services are not monitored. |
| `monitor.req_info`, `req_header`, `req_query`, `req_body`, `req_response` | boolean | | What the report holds. A report is sent only with `req_response`. |
| `monitor.buffer.time`, `buffer.limit` | integer | | Send reports in batches, every `time` ms or every `limit` reports. |

Reports go to the `soamonitor` service, version 1. The body and the response kept for a report are capped by `SOAJS_MAX_BODY_SIZE` and `SOAJS_MAX_RESPONSE_SIZE`.

```json
"gotoService": {"monitor": {"blacklist": ["oauth", "urac"], "req_info": true, "req_response": true}}
```

## The `oauth` entry

| Key | Type | Description |
|---|---|---|
| `roaming.services.<service>.whitelistips` | string[] | Gateway IPs allowed to send roaming calls to this service: calls a gateway of another environment forwards with the user it has already checked. |
| `pinWrapper.servicename`, `pinWrapper.apiname` | string | The route a user logged in without their PIN may call to enter it. |
| `pinWhitelist.<service>.<method>.apis` | string[] | More routes allowed before the PIN is entered. |
| `pinWhitelist.<service>.<method>.regex` | string[] | The same, as regular expressions. |

```json
{
  "name": "oauth",
  "value": {
    "roaming": {"services": {"orders": {"whitelistips": ["10.0.12.4"]}}},
    "pinWrapper": {"servicename": "auth", "apiname": "/pin/login"},
    "pinWhitelist": {"auth": {"get": {"apis": ["/pin/status"], "regex": []}}}
  }
}
```

See [PIN login](/docs/security/oauth/#pin-login).

## The `urac` entry

| Key | Type | Description |
|---|---|---|
| `masterDB` | string | The core database that holds users and groups. Required by the Go gateway, which reads users only there. Without it, calls that need the user answer `146`. |
| `tenantAccessResolvers.<name>` | object | A resolver: `service` and `api` (required), `version` (default latest), `method` (default `post`), `timeout` (default `2000` ms). |
| `autoRoaming.<tenant id>.<home tenant id>.groups` | string[] | Groups given to users of the home tenant when they call under the tenant. |

```json
{
  "name": "urac",
  "value": {
    "masterDB": "users",
    "tenantAccessResolvers": {
      "department": {"service": "departments", "version": "1", "api": "/tenant/access", "timeout": 2000}
    }
  }
}
```

See [Tenant access resolver](/docs/concepts/tenant-access-resolver/).

## Key configuration

A tenant key can carry gateway settings in its configuration, under `gateway`. They apply to calls made with that key.

| Key | Type | Description |
|---|---|---|
| `throttling.<service>` | object | Per-service throttling, with the same keys as `traffic.throttling`. Replaces the custom registry's block for this tenant. |
| `networkPackages.<network>.<product>.default` | string | Package used instead of the key's package when `lastSeen.network` is `<network>`. |
| `networkPackages.<network>.<product>.users.<package>` | string | Package used instead of a user's package, on the same network. |
| `validateTokenAccount.email`, `validateTokenAccount.phone` | boolean | Refuse a token (`146`) when the user's email or phone changed after it was issued. |

```json
{
  "gateway": {
    "throttling": {"payments": {"privateAPIStrategy": "heavy"}},
    "validateTokenAccount": {"email": true}
  }
}
```

A key's configuration per service, `config.<service>.url` and `urls`, sends that tenant's calls to another address for endpoint-type services. The Go gateway does not support endpoint-type services.
