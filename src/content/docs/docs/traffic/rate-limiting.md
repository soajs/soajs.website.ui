---
title: Rate limiting
description: Gateway throttling strategies for public and private APIs, per-service overrides, and the IP ban list.
sidebar:
  order: 3
---

The gateway's `traffic` middleware limits how many requests a client can make in a time window. Limits are defined as named **strategies** in the environment registry and applied separately to public and private APIs.

## Strategies

Strategies live in the environment record under `services.config.throttling` (`registry.serviceConfig.throttling`). The console service manages them with `GET /registry/throttling` and `PUT /registry/throttling`.

```json
{
  "throttling": {
    "publicAPIStrategy": "default",
    "privateAPIStrategy": "heavy",
    "default": {
      "type": 1,
      "window": 60000,
      "limit": 50,
      "retries": 2,
      "delay": 1000
    },
    "heavy": {
      "type": 1,
      "window": 60000,
      "limit": 500,
      "retries": 2,
      "delay": 1000
    }
  }
}
```

| Key | Description |
|---|---|
| `publicAPIStrategy` | Strategy name applied to public APIs. Empty or missing turns throttling off for them. |
| `privateAPIStrategy` | Strategy name applied to private APIs. Empty or missing turns throttling off for them. |
| `<strategy>.type` | `1`: count per tenant and client IP. Any other value: count per tenant across all IPs. |
| `<strategy>.window` | Window length in milliseconds. The counter resets when the window has elapsed since its first request. |
| `<strategy>.limit` | Maximum requests per window. |
| `<strategy>.retries` | When over the limit, how many times the gateway waits and checks again before rejecting. |
| `<strategy>.delay` | Wait between those checks, in milliseconds. |

Whether a request is public or private comes from the package ACL (see [Access control](/docs/concepts/access-control/#public-and-private-apis)). Throttling only applies to requests that resolved a tenant, that is, requests carrying a valid external key.

## Per-service overrides

You can apply a different strategy to one service, or to some of its APIs. The override is read from the first of:

1. the tenant key configuration, `gateway.throttling` (per tenant);
2. the custom registry entry `gateway`, `traffic.throttling` (per environment).

```json
{
  "traffic": {
    "model": "mongo",
    "throttling": {
      "oauth": {
        "publicAPIStrategy": "strict",
        "apis": ["/token"]
      }
    }
  }
}
```

| Key | Description |
|---|---|
| `<service>.publicAPIStrategy` / `.privateAPIStrategy` | Strategy name to use for this service. It must exist in the environment's strategies. An empty value turns throttling off for the service. |
| `<service>.apis` | Optional list of API paths. When set, the override applies only to those paths. |

## Storage

| Key (custom registry `gateway`) | Description |
|---|---|
| `traffic.model` | `memory` (default, per gateway instance) or `mongo` (shared across instances). Any other value turns throttling off and logs an error. |

With more than one gateway instance, use `mongo` so counters are shared. The MongoDB model keeps counters in the `throttling_monitor` collection of the gateway database (or the provisioning database), and records rejected clients in `throttling_error`.

## When the limit is hit

After the configured retries, the gateway answers `429`:

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 45
X-RateLimit-Limit: 50
X-RateLimit-Remaining: -1
Content-Type: application/json

{"status": 429, "msg": "too many requests"}
```

`Retry-After` is the remaining time in the window, in seconds. These headers are only sent on the `429` response.

## IP ban list

The `ip2ban` middleware runs early in the pipeline, before any key or service lookup. Client IPs listed in the custom registry entry `gateway` are rejected:

```json
{
  "traffic": {
    "ip2ban": ["203.0.113.7", "198.51.100.23"]
  }
}
```

```http
HTTP/1.1 403 Forbidden
Content-Type: application/json

{"status": 403, "msg": "banned"}
```

Entries are compared to the client IP as exact strings; CIDR ranges are not expanded.
