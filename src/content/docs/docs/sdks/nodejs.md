---
title: Node.js
description: Use soajs.nodejs to run an existing Express (or other Node.js) service behind the SOAJS gateway.
sidebar:
  order: 1
---

There are two ways to write a Node.js service for SOAJS:

- The **`soajs` framework**, which builds the Express 5 app for you, validates inputs and runs the maintenance port. See [Your first service](/docs/getting-started/first-service/).
- The **`soajs.nodejs` middleware**, for an app you already have. It loads the registry and decodes the gateway's `soajsinjectobj` header into `req.soajs`. You keep your own routing, validation and server.

This page covers `soajs.nodejs` (version 2.0.3).

## Install

```bash
npm install soajs.nodejs
```

## Use with Express

```js
const express = require("express");
const soajsMW = require("soajs.nodejs");

const app = express();

app.use(soajsMW({
	serviceName: "orders",
	serviceGroup: "Shop",
	servicePort: 4300,
	serviceVersion: 1
}, (err) => {
	if (err) {
		console.error("SOAJS middleware failed to initialize:", err);
		process.exit(1);
	}
}));

app.get("/list", (req, res) => {
	const tenant = req.soajs.tenant;      // id, code, key, application, ...
	const user = req.soajs.urac;          // set when the service gets the user
	res.json({ tenant: tenant.code });
});

app.listen(4300);
```

The optional callback receives `(err, reg)` once the registry has loaded.

## Environment variables

| Variable | Description |
|---|---|
| `SOAJS_REGISTRY_API` | `hostname:port` of the gateway maintenance port. Required to load the registry. |
| `SOAJS_ENV` | Environment code. Required to load the registry. |
| `SOAJS_DEPLOY_MANUAL` | When set (and not `0`), the middleware registers the service with the gateway (`/register`) using the configuration you passed. |
| `SOAJS_DEPLOY_HA` | Set in Kubernetes; enables direct `interConnect` routing in `awareness.connect`. |

When registering, the middleware sends `serviceName`, `serviceGroup`, `servicePort`, `serviceVersion`, `requestTimeout`, `requestTimeoutRenewal`, `extKeyRequired`, `urac`, `urac_Profile`, `urac_ACL` and the other flags from your configuration, so pass the same keys you would put in a `soajs` `config.js`.

## `req.soajs`

| Property | Content |
|---|---|
| `tenant` | `id`, `code`, `type`, `name`, `main`, `profile`, `key` (`iKey`, `eKey`), `application` (`product`, `package`, `appId`, `acl`) |
| `urac` | The logged-in user, when forwarded by the gateway. |
| `servicesConfig` | Configuration stored on the tenant key: the `commonFields` entry plus the entry named after this service. |
| `device`, `geo` | Device and geo information. |
| `awareness` | `getHost` and `connect` for calling other services. |
| `reg` | Registry access (below). |

## Registry access

```js
const all = req.soajs.reg.getDatabases();          // core and tenant meta databases
const db = req.soajs.reg.getDatabases("orders");    // one database
const cfg = req.soajs.reg.getServiceConfig();
const custom = req.soajs.reg.getCustom();
const resources = req.soajs.reg.getResources();
const svc = req.soajs.reg.getServices("payment");
const daemons = req.soajs.reg.getDaemons();
req.soajs.reg.reload((err, ok) => { /* ... */ });
req.soajs.reg.stopAutoReload();
```

The middleware reloads the registry periodically when the environment's service configuration (`getServiceConfig()`) has `awareness.autoReloadRegistry` set, in milliseconds.

:::caution
The default environment record and the gateway spell this key `autoRelaodRegistry`. `soajs.nodejs` 2.0.3 only reads `autoReloadRegistry`, so with the default record it does not auto-reload. Add the correctly spelled key to the environment, or call `reload()` yourself.
:::

## Calling other services

```js
req.soajs.awareness.connect("payment", "1", (response) => {
	// response.host     -> where to send the call
	// response.headers  -> headers to forward
});
```

- In Kubernetes (`SOAJS_DEPLOY_HA` set) with the target listed in `interConnect`, `host` is the target service directly and `headers` carries `soajsinjectobj`, so the target sees the same tenant and user.
- Otherwise `host` is the gateway URL for the service, and `headers` carries the caller's `key` and `access_token`.

The version argument is optional: `connect("payment", cb)` targets the latest version.

## Examples

- Express: [soajs/soajs.nodejs.express](https://github.com/soajs/soajs.nodejs.express)
- Hapi: [soajs/soajs.nodejs.hapi](https://github.com/soajs/soajs.nodejs.hapi)
