---
title: Response caching
description: Cache GET responses at the gateway per API, with a TTL and a tenant or tenant-and-user scope, and let services remove entries they know changed.
sidebar:
  order: 1
---

The gateway can cache responses of selected GET APIs and serve repeat requests without calling the service. Caching is off unless configured, and it is enabled per service and per API.

## Configure

Add a `cache` block to the custom registry entry named `gateway`:

```json
{
  "cache": {
    "model": "mongo",
    "defaultTTL": 300000,
    "services": {
      "catalog": {
        "enabled": true,
        "apis": {
          "GET /products": { "enabled": true, "ttl": 600000 },
          "GET /product/:id": { "enabled": true, "ttl": 60000 },
          "GET /categories": { "enabled": true }
        }
      },
      "account": {
        "enabled": true,
        "apis": {
          "GET /profile": { "enabled": true, "ttl": 60000, "scope": "tenant_user" }
        }
      }
    }
  }
}
```

| Key | Default | Description |
|---|---|---|
| `model` | `"memory"` | Storage: `memory` (per gateway instance) or `mongo` (shared). Any other value turns caching off and logs an error. |
| `defaultTTL` | `300000` | TTL in milliseconds for APIs without `ttl`. |
| `services.<name>.enabled` | off | Enables caching for the service. |
| `services.<name>.apis["GET <path>"].enabled` | off | Enables caching for the API. |
| `services.<name>.apis["GET <path>"].ttl` | `defaultTTL` | TTL in milliseconds. |
| `services.<name>.apis["GET <path>"].scope` | inferred | `tenant` or `tenant_user`. |

API keys are `GET <path>`, where `<path>` is the service's own path (without the service name prefix). Segments starting with `:` match any value. With more than one gateway instance, use `mongo`, otherwise each instance has its own cache.

## Scope

| Scope | Cache key includes | Default for |
|---|---|---|
| `tenant` | tenant id | public APIs |
| `tenant_user` | tenant id and user id | private APIs |

Whether an API is public or private comes from the package ACL (see [Access control](/docs/concepts/access-control/#public-and-private-apis)). If an API resolves to `tenant_user` but no logged-in user is on the request, the response is **not** cached, so a user-scoped entry is never shared. An unknown `scope` value is logged and ignored, and the inferred default applies.

The cache key is:

```
l1: <tenant id>
l2: <service>:GET:<path>:<query hash>[:u:<user id>]
```

The query hash is the MD5 of the query parameters sorted by name, so `?page=1&limit=10` and `?limit=10&page=1` share an entry, while a request without a query string has its own.

`access_token` is not part of the hash: it identifies the caller, not what is asked for, and the user of a `tenant_user` entry is already in the key. Before `soajs.controller` 4.3.20 it was, so every token got its own entry, a `tenant` scoped API was not shared between users, and a user's entries stopped matching after each login or token refresh.

## Behavior

- Only `GET` requests are considered.
- Only `2xx` responses are stored. The status code, headers and body are cached.
- On a hit, the gateway replies directly with `X-Cache: HIT` and `X-Cache-Age` (seconds since the entry was stored). The service is not called.
- On a miss, the gateway sets `X-Cache: MISS`, calls the service, and stores the response if it is `2xx`.
- The cache runs after authentication, ACL and rate limiting, so a cached response is only served to a caller who passes those checks.
- With `mongo`, entries are stored in the `cache_store` collection of the gateway database (or the provisioning database if no gateway database is configured), with a TTL index on `expiresAt`.


```http
HTTP/1.1 200 OK
X-Cache: HIT
X-Cache-Age: 15
Content-Type: application/json

{"result": true, "data": [...]}
```

## Invalidation

An entry normally lives until its TTL. A service that knows something changed can remove the affected entries right away, by calling the gateway's maintenance port. Available from `soajs.controller` 4.3.20, with the `mongo` model only: it is the one shared by every gateway instance, so one call clears the entry everywhere. With `memory` the route answers `400`.

```bash
curl -X POST "http://<gateway-host>:<maintenance-port>/cache/invalidate" \
  -H "Content-Type: application/json" \
  -d '{"tenant": "<tenant id>", "service": "spaces", "api": "GET /spaces", "user": "<user id>"}'
```

```json
{ "result": true, "data": { "removed": 3 } }
```

| Field | Required | Description |
|---|---|---|
| `tenant` | yes | The tenant the GET was cached under: the tenant of the key used to call it. |
| `service` | yes | The service name. |
| `api` | no | The API as written in the cache configuration, for example `GET /spaces` or `GET /space/:id`. Without it, every API of the service. |
| `user` | no | A user id. Only that user's `tenant_user` entries. Without it, every user's entries and the `tenant` scoped entry. |

Every cached variant of a matching entry is removed: every query string, and every value of a path parameter, so `GET /space/:id` clears `/space/1`, `/space/2` and so on.

### Example

A service caches `GET /spaces`, the spaces a user is invited to, per user. When user A invites user B, the invite API removes B's entry before it answers, so B's next call loads the new list:

```javascript
// at the end of the invite API, before replying
await post(`http://${gatewayHost}:${maintenancePort}/cache/invalidate`, {
  "tenant": req.soajs.tenant.id,
  "service": "spaces",
  "api": "GET /spaces",
  "user": invitedUserId
});
```

Wait for the call with a short timeout. If the gateway cannot be reached, the change still stands and the entry expires on its TTL.

The maintenance port is internal to your cluster, never expose it to clients.

### Requests already in flight

A GET that started before the invalidation may have read the data before the change. Its response is still sent to the caller but not stored, so it cannot put the old response back. Invalidations are kept 15 minutes in the `cache_invalidation` collection for this check, which compares gateway clocks: keep them in sync.

Entries cached before 4.3.20 are not matched by an invalidation. They expire on their TTL.

| Status | Reason |
|---|---|
| `200` | Removed. `data.removed` is the number of entries. |
| `400` | Missing `tenant` or `service`, an `api` not written as `GET /path`, a `user` that is not a string, caching not configured, or not the `mongo` model. |
| `405` | Not a `POST`. |
| `500` | The cache store failed or is not ready. |
