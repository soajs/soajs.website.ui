---
title: Overview
description: What the SOAJS gateway does, the Node.js and Go builds, and how to choose between them.
sidebar:
  order: 1
---

The gateway is the single entry point for API traffic in an environment. Every call goes through it. It resolves the tenant from the external key, applies the package ACL, validates the access token, enforces rate limits, and routes the call to a healthy host of the service. How a request moves through it is described in [Gateway concepts](/docs/concepts/gateway/).

This section is the reference for running and configuring it:

- [Run it](/docs/gateway/run/): npm, Docker, Helm, and the environment variables.
- [Environment registry](/docs/gateway/environment-registry/): ports, CORS, OAuth, throttling strategies and awareness, from the environment record.
- [Custom registry](/docs/gateway/custom-registry/): the `gateway`, `oauth` and `urac` entries that turn features on.
- [Routes](/docs/gateway/routes/): the built-in `/soajs/*` routes and the maintenance port.
- [Node.js and Go](/docs/gateway/node-vs-go/): what the Go gateway leaves out or does differently.

## Two builds

| | Node.js | Go |
|---|---|---|
| Repository | [soajs.controller](https://github.com/soajs/soajs.controller) | [soajs.controller.go](https://github.com/soajs/soajs.controller.go) |
| Current version | 4.3.30 | 4.4.29 |
| Docker image | `soajsorg/gateway` | `soajsorg/gateway-go` |
| npm package | `soajs.controller` | none, a single binary |
| Helm chart | `soajs-controller` in [soajs.helm](https://github.com/soajs/soajs.helm) | none yet |
| Data it reads | every shape the console has written over time | the latest data schema only |

Both builds read the same profile file, the same databases and the same registry. They use the same URL scheme and the same ports, and they answer the same way. The Node.js gateway, `soajs.controller` 4.3.30, is the specification. A conformance harness replays 127 requests against both on the same data and compares the status, the headers and the body byte for byte. It also compares the [call events](/docs/traffic/call-events/) each one writes. Both pass all of them.

## How to choose

Use the **Node.js gateway** when:

- you install SOAJS with the Helm charts, which deploy it;
- your data still has older shapes, such as per-tenant urac databases or application-level ACLs;
- you use JWT access tokens (oauth type 0) or endpoint-type services.

Use the **Go gateway** when:

- your data is on the latest schema, or you can move it there;
- you want a single static binary in a small image.

The Go gateway is new. Run it next to the Node.js gateway in a test environment before you move production traffic to it. You can run both against the same environment: they read the same data, and you can move traffic one gateway at a time.

The full list of differences is in [Node.js and Go](/docs/gateway/node-vs-go/).

## Configuration sources

The gateway reads its configuration from four places:

| Source | Where | Examples |
|---|---|---|
| Environment variables | the process | `SOAJS_ENV`, `SOAJS_PROFILE`, `SOAJS_DEPLOY_HA`. See [Run it](/docs/gateway/run/#environment-variables). |
| Profile file | the file named by `SOAJS_PROFILE` | where the provision database is |
| Environment registry | the environment record, `services.config` and `services.controller` | `ports`, `cors`, `oauth`, `throttling`, `awareness`. See [Environment registry](/docs/gateway/environment-registry/). |
| Custom registry | the entries named `gateway`, `oauth` and `urac` | `maintenanceMode`, `traffic`, `cache`, `idempotency`, `events`, `mcp`. See [Custom registry](/docs/gateway/custom-registry/). |

A tenant key can also carry gateway settings in its `config.gateway`, for example throttling overrides. See [Key configuration](/docs/gateway/custom-registry/#key-configuration).
