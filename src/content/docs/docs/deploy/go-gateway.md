---
title: Go gateway
description: The SOAJS gateway written in Go, released as 4.4.29. It answers as the Node.js gateway does, checked request by request, and reads the latest data schema only.
sidebar:
  order: 3
  badge:
    text: New
    variant: success
---

:::note[Released: 4.4.29]
The Go gateway is released as version 4.4.29, with the Docker image `soajsorg/gateway-go:4.4.29` (also tagged `4.x` and `latest`). It is new: run it next to the Node.js gateway in a test environment before you move production traffic to it. Releases before 4.4.28 are superseded and should not be used.
:::

The Go gateway ([soajs.controller.go](https://github.com/soajs/soajs.controller.go)) is the SOAJS gateway written in Go. The Node.js gateway, `soajs.controller` 4.3.30, is its specification. It reads the same profile and databases, uses the same URL scheme (`/<service>[/v<N>]/<path>`), and answers the same way.

## How parity is checked

A conformance harness replays 127 requests against both gateways on the same fixture database. It compares the status, the headers and the body byte for byte, and both gateways pass all of them. It also compares the [call events](/docs/traffic/call-events/) each gateway writes, which are identical. The requests cover:

- keys, package ACLs, OAuth, restricted tokens, device binding, PIN, and paused users;
- proxying, roaming, `soajsinjectobj` and HEAD;
- throttling, idempotency and the response cache;
- the maintenance port;
- `/soajs/acl`, `/soajs/proxy` and [MCP](/docs/concepts/mcp/), including agent tokens.

## Latest data schema only

The Go gateway reads only the current shape of each collection, and carries no code for older shapes. A document that does not match its schema is logged, then skipped or refused, never converted. The schema of every collection the gateway reads is in the repository's [data-schema](https://github.com/soajs/soajs.controller.go/tree/main/docs/data-schema) folder, with a checker you can run against a database.

Two settings matter when you move an existing environment to the Go gateway:

- **urac:** the custom registry `urac` entry must set `masterDB`, the core database that holds users and groups. The Go gateway reads urac there only.
- **Booleans:** settings such as `cors.credentials` must be stored as true or false, not as text.

## Run

With Docker:

```bash
docker run -e SOAJS_ENV=dev -e SOAJS_PROFILE=/opt/soajs/profile/soajsprofile \
  -v /path/to/soajsprofile:/opt/soajs/profile/soajsprofile:ro \
  -p 4000:4000 soajsorg/gateway-go:4.4.29
```

From source:

```bash
make build    # bin/controller (Go 1.25+)
SOAJS_ENV=dev SOAJS_PROFILE=/opt/soajs/profile/soajsprofile ./bin/controller
```

- **`SOAJS_PROFILE`** is required. It is the same profile file the Node.js gateway reads, and it says where the provision database is.
- **`SOAJS_ENV`** is the environment whose registry is loaded.
- **Ports:** the gateway listens on `SOAJS_SERVICE_PORT` (4000). The maintenance port comes from the registry: `serviceConfig.ports.controller` + `maintenanceInc`.

Every setting is listed in [configuration](https://github.com/soajs/soajs.controller.go/blob/main/docs/configuration.md).

## Routes

| Port | Routes |
|---|---|
| Gateway | `/<service>[/v<N>]/<path>`, `/soajs/acl`, `/soajs/proxy`, `/soajs/mcp`, `/.well-known/*` (MCP authorization metadata) |
| Maintenance | `/heartbeat`, `/reloadRegistry`, `/loadProvision`, `/getRegistry`, `/awarenessStat`, `POST /register`, `POST /cache/invalidate` |

## Differences from the Node.js gateway

Each difference below is deliberate. The full list, with the pull request for each, is in [differences](https://github.com/soajs/soajs.controller.go/blob/main/docs/differences.md).

**Not ported:**

- JWT access tokens (oauth type 0);
- endpoint-type services;
- `/proxy/redirect`;
- `GET /register`;
- older data shapes, including per-tenant urac databases and `access` as a list of groups.

**Behaviour:**

- **Kubernetes:** the namespace is read from the current deployer shape only. A deployer without a namespace gives no host.
- **Idempotency:** the lock is taken in one atomic operation. An answer is still recorded if the client disconnects.
- **Registry dumps:** never include connection-pool options.
