---
title: Your first service
description: Build a Node.js microservice with the soajs framework, register it, and call it through the gateway.
sidebar:
  order: 2
---

A SOAJS service is an Express 5 application wrapped by the `soajs` framework. The framework loads the environment registry from the gateway, validates inputs against a JSON schema (IMFV), reads the tenant and user context the gateway injects, and exposes a maintenance port with `/heartbeat`, `/reloadRegistry` and `/loadProvision`.

## 1. Create the project

```bash
mkdir hello && cd hello
npm init -y
npm install soajs
```

## 2. Describe the service in `config.js`

```js
// config.js
module.exports = {
	"type": "service",
	"prerequisites": { "cpu": "", "memory": "" },
	"serviceVersion": 1,
	"serviceName": "hello",
	"serviceGroup": "Examples",
	"servicePort": 4100,
	"requestTimeout": 30,
	"requestTimeoutRenewal": 5,
	"extKeyRequired": true,
	"oauth": false,
	"urac": false,

	"maintenance": {
		"readiness": "/heartbeat",
		"port": { "type": "maintenance" },
		"commands": [
			{ "label": "Reload Registry", "path": "/reloadRegistry", "icon": "fas fa-undo" },
			{ "label": "Resource Info", "path": "/resourceInfo", "icon": "fas fa-info" }
		]
	},

	"errors": {
		400: "Business logic required data are missing."
	},

	"schema": {
		"get": {
			"/hello": {
				"_apiInfo": { "l": "Say hello", "group": "Example" },
				"firstName": {
					"source": ["query.firstName"],
					"required": true,
					"validation": { "type": "string" }
				}
			}
		}
	}
};
```

### Configuration keys

| Key | Default | Description |
|---|---|---|
| `type` | required | `service` for a REST service. |
| `serviceName` | required | Name the gateway routes on (`/<serviceName>/...`). Lower-cased at init. |
| `serviceGroup` | `"No Group Service"` | Group shown in the console. |
| `serviceVersion` | `1` | Version, format `1` or `1.1`. |
| `servicePort` | `null` | Data port. |
| `requestTimeout` | `null` | Timeout the gateway applies when proxying to this service (the core services use `30`). |
| `requestTimeoutRenewal` | `null` | How many times the gateway renews `requestTimeout` for a long-running request (total wait is `requestTimeout + requestTimeout × requestTimeoutRenewal`). |
| `extKeyRequired` | `false` | When `true`, calls must go through the gateway with a valid external key, and the tenant/key/application context is available on `req.soajs`. |
| `oauth` | `true` | When `true`, private APIs (per the package ACL) require a valid access token. |
| `urac` | `false` | When `true`, the gateway resolves the logged-in user and forwards it on `req.soajs.urac`. |
| `urac_Profile`, `urac_ACL`, `urac_Config`, `urac_GroupConfig` | `false` | Forward the user's profile, ACL, config and group config. |
| `tenant_Profile` | `false` | Forward the tenant profile. |
| `provision_ACL` | `false` | Forward the application and package ACL. |
| `interConnect` | `null` | List of `{ "name", "version" }` services this service calls directly (see `awareness.connect` below). |
| `maintenance` | | Readiness path, maintenance port type and console commands. |
| `errors` | | Map of error code to message, used by `req.soajs.buildResponse`. |
| `schema` | | API definitions per HTTP method, with IMFV input validation. |
| `bodyParser`, `methodOverride`, `cookieParser`, `inputmask` | `true` | Built-in middleware toggles. The JSON/urlencoded body limit defaults to 1 MB. |
| `session` | off | Enables `express-session` with a MongoDB store. |

### Input mapping (IMFV)

Each API entry in `schema` lists its inputs. `source` is an ordered list of places to read the value from (`query.x`, `body.x`, `params.x`, `headers.x`, `cookies.x`), and `validation` is a JSON schema. Validated values are available on `req.soajs.inputmaskData`. Fields shared by several APIs can be declared once under `schema.commonFields` and referenced by name.

## 3. Implement the APIs

```js
// index.js
const soajs = require("soajs");
const config = require("./config.js");

const service = new soajs.server.service(config);

service.init(() => {
	service.get("/hello", (req, res) => {
		const name = req.soajs.inputmaskData.firstName;
		res.json(req.soajs.buildResponse(null, { "message": "Hello " + name }));
	});

	service.start();
});
```

`service.get`, `service.post`, `service.put`, `service.delete` and `service.all` register routes. Declare each route's inputs under `schema` so IMFV validates them. Requests to a path with no registered route return error `151`.

`req.soajs.buildResponse(error, data)` produces the standard envelope:

```json
{ "result": true, "data": { "message": "Hello Jane" } }
```

and on error, `{ "code": 400, "msg": "..." }` becomes:

```json
{ "result": false, "errors": { "codes": [400], "details": [{ "code": 400, "message": "..." }] } }
```

## 4. Run it against an environment

The service loads its registry from the gateway's maintenance port:

```bash
export SOAJS_ENV=dev                         # environment code
export SOAJS_REGISTRY_API=<gateway-host>:5000  # gateway maintenance host:port
node .
```

| Variable | Purpose |
|---|---|
| `SOAJS_ENV` | Environment to load the registry for. |
| `SOAJS_REGISTRY_API` | `hostname:port` of the gateway maintenance port. |
| `SOAJS_SRVPORT` | Override the data port. |
| `SOAJS_SRVIP` | IP to register for awareness. |
| `SOAJS_DEPLOY_HA` | Set to `kubernetes` when deployed in Kubernetes. Hosts are then resolved by the cluster and the service does not self-register. |
| `SOAJS_SRV_AUTOREGISTERHOST` | Defaults to `true`: on start, the service registers its host with the gateway (outside HA mode). |
| `SOAJS_SOLO` | `true` runs the service standalone: `extKeyRequired` and `session` are turned off. |

On start the service listens on its data port and on a maintenance port (data port + `maintenanceInc` from the environment registry, 1000 by default). Outside HA mode, when `SOAJS_ENV` is not `dashboard` and `SOAJS_SRVPORT` is not set, both ports are also offset by the environment's `ports.controller` value.

## 5. Register the service and grant access

Before the gateway routes to `hello`:

1. **The service must be in the catalog.** Outside Kubernetes, the service auto-registers with the gateway when it starts (if the environment's `awareness.autoRegisterService` is on). In Kubernetes, add the repository through the Repositories service so the catalog item is created from your `config.js` or [`soa.json`](/docs/deploy/soa-json/), then deploy it.
2. **The package must allow it.** Add `hello` (version `1`) to the ACL of the product package your application uses. With `extKeyRequired: true`, a key whose package does not include the service gets error `154`. See [Access control](/docs/concepts/access-control/).

## 6. Call it through the gateway

```bash
curl "https://<your-api-domain>/hello/hello?firstName=Jane" \
  -H "key: <your-ext-key>"
```

The gateway URL is `/<serviceName>/<api path>`. To target a version explicitly, use `/<serviceName>/v<version>/<api path>`.

If the API is private in the package ACL, also send the user's token:

```bash
curl "https://<your-api-domain>/hello/hello?firstName=Jane" \
  -H "key: <your-ext-key>" \
  -H "access_token: <access-token>"
```

## Using the request context

When the call comes through the gateway with `extKeyRequired: true`, `req.soajs` carries:

| Property | Content |
|---|---|
| `req.soajs.tenant` | `id`, `code`, `name`, `type`, `key` (`iKey`, `eKey`), `application` (`product`, `package`, `appId`) and, when enabled, `profile`. |
| `req.soajs.urac` | The logged-in user when `urac: true` and a valid token was sent. |
| `req.soajs.servicesConfig` | Configuration stored on the tenant key: the `commonFields` entry plus the entry named after this service. |
| `req.soajs.registry` | The environment registry. |
| `req.soajs.awareness` | Service discovery helpers. |

To call another service, list it under `interConnect` and use `awareness.connect`. It returns a host and the headers to forward (in Kubernetes with `interConnect`, a direct host and the `soajsinjectobj` header; otherwise the gateway host with the caller's key and token):

```js
req.soajs.awareness.connect("otherservice", "1", (response) => {
	// response.host, response.headers
});
```
