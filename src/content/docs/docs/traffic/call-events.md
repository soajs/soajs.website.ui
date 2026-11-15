---
title: Call events
description: One record per call through the gateway, written in the background to MongoDB, for activity logs, metering and agent traces.
sidebar:
  order: 4
---

The gateway can write one record for each call it handles: who called, which API, what happened and how long it took. Use it for activity logs, usage metering, and a per-call trace of what AI agents did. The Node.js gateway (4.3.30+) and the Go gateway (4.4.29+) write identical records, so both can write to the same collection.

## What a record holds

- **Who:**
  - the tenant, with its main tenant for a sub-tenant;
  - the product, package and application of the key;
  - the signed-in user, with `agent: true` when the token is restricted to an agent.
- **What:** the service and version, the HTTP method, and the API **route** the ACL matched (`/orders/:id`), never the raw path. A call through [MCP](/docs/concepts/mcp/) also records the tool name.
- **Result:** the HTTP status, the SOAJS error code if any, and the duration. `idempotency: "replay"` or `cache: "HIT"` marks answers the service did not produce.
- **When and from where:** the time and the client IP.

A record never holds request or response bodies, query values, headers, tokens or keys.

Covered calls:
- every call answered by a service;
- every refusal from the key check onward, including an unknown key.

Refusals before that, such as an unknown service or a banned IP, have no record.

## How it is written

Records go into a bounded queue and are written in the background, in batches of up to 200 or at least every second. A request never waits for its record. When the queue is full, or the database is unavailable, records are dropped and the count is logged at most once a minute. Records still queued are written when the gateway stops cleanly.

The `mongo` sink writes to a time-series collection (`ts` as the time field, `tenant` as the meta field) in one of the environment's core databases, and creates it if needed. Retention is the collection's to set, with `expireAfterSeconds`. The `log` sink writes records to the gateway log, for debugging.

## Configure

In the environment's custom registry, entry `gateway`:

```json
"events": {
  "enabled": true,
  "sink": "mongo",
  "mongo": {"db": "gateway", "collection": "call_events"},
  "queueSize": 10000,
  "services": {"orders": {"enabled": true}}
}
```

| Key | Meaning |
|---|---|
| `enabled` | Turns call events on. Off, the gateway does nothing extra. |
| `sink` | `mongo` or `log`. |
| `mongo.db`, `mongo.collection` | The core database (by its name in the environment's databases) and the collection. |
| `queueSize` | The most records waiting to be written; more are dropped and counted. |
| `services` | Optional: limit records to these services. |

Size `queueSize` and retention for refusals too: under misuse, calls with an unknown key are the most numerous records.
