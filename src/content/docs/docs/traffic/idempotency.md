---
title: Idempotency keys
description: Make write APIs safe to retry with the Idempotency-Key header, handled by the gateway.
sidebar:
  order: 2
---

Clients retry. A network timeout, a crash, or a message delivered on more than one channel can send the same write twice. The gateway can deduplicate these: when a client sends an `Idempotency-Key` header on a configured write API, the gateway runs the request once and replays the stored response for any repeat within the TTL.

## Client side

Generate one UUID v4 per logical operation and reuse it on every retry of that operation:

```bash
curl -X POST "https://<your-api-domain>/payment/charge" \
  -H "key: <your-ext-key>" \
  -H "access_token: <access-token>" \
  -H "Idempotency-Key: 6f1c2a0e-3b7d-4c8e-9a51-0d2f4e6b8c13" \
  -H "Content-Type: application/json" \
  -d '{"amount": 1000}'
```

The key must be a UUID v4. Any other format is rejected with `400` (code `180`), whether or not the API is configured.

## Configure

Add an `idempotency` block to the custom registry entry named `gateway`:

```json
{
  "idempotency": {
    "model": "mongo",
    "enforce": false,
    "services": {
      "payment": {
        "enabled": true,
        "enforce": true,
        "ttl": 120000,
        "apis": ["POST /charge", "POST /refund"]
      },
      "orders": {
        "enabled": true,
        "ttl": 60000,
        "apis": ["POST /order", "PUT /order/:id/cancel"]
      }
    }
  }
}
```

| Key | Default | Description |
|---|---|---|
| `model` | `"memory"` | Storage: `memory` (per gateway instance) or `mongo` (shared). Any other value turns idempotency off and logs an error. |
| `enforce` | `false` | Global default: require the header on matched APIs. |
| `services.<name>.enabled` | off | Enables idempotency for the service. |
| `services.<name>.enforce` | global `enforce` | Overrides the global default for this service (boolean only). |
| `services.<name>.ttl` | `60000` | How long a key is remembered, in milliseconds. |
| `services.<name>.apis` | all write APIs | `METHOD /path` entries, path relative to the service. Segments starting with `:` match any value. If `apis` is omitted, every non-GET API of the service is covered. |

GET requests are never processed. Use `mongo` when the gateway runs more than one instance, so retries landing on another instance are recognised.

## Behavior

For a non-GET request to a matched API:

| Situation | Result |
|---|---|
| No `Idempotency-Key`, enforcement off | Request passes through unchanged. |
| No `Idempotency-Key`, enforcement on | `428`, code `182`: Idempotency-Key header is required for this API. |
| Key not seen before | The key is locked as in flight and the request goes on. What happens to the key then depends on how the request ends, see below. |
| Key seen, still in flight | `409`, code `181`: Request with this Idempotency-Key is still being processed. |
| Key seen, completed | The stored response is returned as is. The service is not called. |

Keys are scoped per tenant: the same key sent with two different tenants' external keys is tracked separately. With `mongo`, entries are stored in the `idempotency_store` collection of the gateway database (or the provisioning database if none is configured), with a TTL index on `expiresAt`.

## How a locked key ends

Only an answer the service actually produced is stored and replayed. Anything else releases the key, so the client's retry with the same key runs again instead of getting the same refusal until the TTL:

| The request ends with | The key | A retry with the same key |
|---|---|---|
| A service response below `500` (`2xx`, `3xx`, `4xx`) | Stored for `ttl` | Gets the stored response. The service is not called. |
| A service response of `500` or more | Released | Reaches the service again. |
| Proxying to the service fails | Released | Reaches the service again. |
| The gateway answers before the service: throttled (`429`), an error, a refusal | Released | Runs again. |
| The client disconnects before the request reaches the service | Released | Runs again. |
| The client disconnects while the service is answering | Follows the service response, as above | |

A `4xx` is the service's answer to that input and stays replayed: use a new key to retry an operation after fixing its input. A `5xx` is retried with the same key, so a service that can fail with a `5xx` after part of the work is done must protect that work itself.

A release only removes a key that is still in flight and was locked by that request. It never removes a stored response, and never a lock taken by a later retry after the first one's `ttl` ran out.

Before `soajs.controller` 4.3.19, a key locked by a request that the gateway answered itself (a throttled `429`, for example) stayed in flight until its `ttl`, and every retry got `409`/`181`. A `5xx` from the service was stored and replayed.

## Client handling

- Treat `409`/`181` as "still in progress": wait and retry with the same key.
- Retry a `429`, a `5xx` or a network error with the same key.
- Use a new key only for a new operation, or after changing the input of one that got a `4xx`.

## Error codes

| HTTP | Code | Message |
|---|---|---|
| 400 | 180 | Invalid Idempotency-Key format. Expected UUID v4. |
| 409 | 181 | Request with this Idempotency-Key is still being processed. |
| 428 | 182 | Idempotency-Key header is required for this API. |
