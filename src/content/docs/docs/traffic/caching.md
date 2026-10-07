---
title: Response caching
description: Cache GET responses at the gateway per API, with a TTL and a tenant or tenant-and-user scope.
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

## Behavior

- Only `GET` requests are considered.
- Only `2xx` responses are stored. The status code, headers and body are cached.
- On a hit, the gateway replies directly with `X-Cache: HIT` and `X-Cache-Age` (seconds since the entry was stored). The service is not called.
- On a miss, the gateway sets `X-Cache: MISS`, calls the service, and stores the response if it is `2xx`.
- The cache runs after authentication, ACL and rate limiting, so a cached response is only served to a caller who passes those checks.
- With `mongo`, entries are stored in the `cache_store` collection of the gateway database (or the provisioning database if no gateway database is configured), with a TTL index on `expiresAt`.

The gateway exposes no route to invalidate entries: choose a TTL that matches how fresh the data must be.

```http
HTTP/1.1 200 OK
X-Cache: HIT
X-Cache-Age: 15
Content-Type: application/json

{"result": true, "data": [...]}
```
