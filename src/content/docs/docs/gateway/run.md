---
title: Run it
description: Run the Node.js gateway with npm, Docker or Helm, or the Go gateway with Docker, and the environment variables each one reads.
sidebar:
  order: 2
---

Both gateways need two things to start:

- **A profile file**, named by `SOAJS_PROFILE`. It says where the provision database is.
- **An environment**, named by `SOAJS_ENV`. The gateway loads that environment's registry from the provision database. The environment record must exist.

## The profile file

The profile is a Node.js module that exports the connection to the provision database. Both gateways read the same file.

```js
module.exports = {
	"name": "core_provision",
	"prefix": "",
	"servers": [{"host": "127.0.0.1", "port": 27017}],
	"credentials": null,
	"streaming": {},
	"extraParam": {},
	"URLParam": {}
};
```

| Key | Description |
|---|---|
| `name` | Name of the provision database, without the prefix. |
| `prefix` | Prefix added to the database name. |
| `servers` | MongoDB hosts, each with `host` and `port`. |
| `credentials` | `{"username", "password"}`, or `null`. |
| `URLParam` | Options added to the connection string, such as `authSource` or `replicaSet`. |
| `streaming`, `extraParam` | Driver options. |

The Helm chart creates the profile as the `soajsprofile` secret and mounts it at `/opt/soajs/profile/soajsprofile`.

## Node.js gateway

### npm

```bash
npm install soajs.controller
cd node_modules/soajs.controller
SOAJS_ENV=dev SOAJS_PROFILE=/opt/soajs/profile/soajsprofile node .
```

Node.js 24 is the version the gateway is tested with.

### Docker

The image is `soajsorg/gateway`, tagged with the version (`4.3.30`). The code is in `/opt/soajs/soajs.controller/`, and the image has no default command, so give it one:

```bash
docker run --rm \
  -e SOAJS_ENV=dev \
  -e SOAJS_PROFILE=/opt/soajs/profile/soajsprofile \
  -v /path/to/soajsprofile:/opt/soajs/profile/soajsprofile:ro \
  -p 4000:4000 -p 5000:5000 \
  -w /opt/soajs/soajs.controller \
  soajsorg/gateway:4.3.30 node .
```

### Helm

The `soajs-controller` chart in [soajs.helm](https://github.com/soajs/soajs.helm) deploys the gateway in the `dashboard` environment. The image tag is the chart's `appVersion` (4.3.30). The pod sets:

| Variable | Value |
|---|---|
| `SOAJS_ENV` | `dashboard` |
| `SOAJS_PROFILE` | `/opt/soajs/profile/soajsprofile` |
| `SOAJS_DEPLOY_HA` | `kubernetes` |
| `SOAJS_MONGO_CON_KEEPALIVE` | `true` |

It exposes port 4000 and the maintenance port 5000, and uses `GET /heartbeat` on the maintenance port as the readiness probe. See [Helm charts](/docs/deploy/helm/) for the install order.

### Environment variables

| Variable | Default | Description |
|---|---|---|
| `SOAJS_ENV` | `dev` | The environment whose registry is loaded. |
| `SOAJS_PROFILE` | `profiles/single.js` in the package | The profile file. |
| `SOAJS_DEPLOY_HA` | not set | Not set: services register their hosts with the gateway, which health-checks them. `kubernetes`: hosts are resolved through Kubernetes services. See [Service awareness](/docs/concepts/gateway/#service-awareness). |
| `SOAJS_SRVIP` | the host's IP | The IP the gateway registers under. |
| `SOAJS_SRV_AUTOREGISTERHOST` | `true` | Any value other than `true`: register as `127.0.0.1`. |
| `SOAJS_MANUAL` | not set | Set: the gateway's `controllers` document is kept under its IP; otherwise under `127.0.0.1`. |
| `SOAJS_SENSITIVE_ENVS` | `["dashboard"]` | JSON array of environments whose tokens roam to other environments. |
| `SOAJS_SERVER_SHUTDOWN_TIMEOUT` | `10` | Seconds to finish requests in flight on `SIGTERM` or `SIGINT`. See [Stopping the gateway](/docs/concepts/gateway/#stopping-the-gateway). |
| `SOAJS_MAX_INJECT_HEADER_SIZE` | `65536` | Largest `soajsinjectobj` header, in characters. A larger one answers `135`. |
| `SOAJS_MAX_BODY_SIZE` | `10485760` | Bytes of a request body kept for request monitoring (`gotoService.monitor.req_body`). It does not limit the request. |
| `SOAJS_MAX_RESPONSE_SIZE` | `10485760` | Bytes of a response kept for request monitoring (`gotoService.monitor.req_response`). |
| `SOAJS_THROTTLE_CLEANUP_INTERVAL` | `60000` | How often, in ms, the memory model of throttling drops expired entries. |
| `SOAJS_IDEMPOTENCY_CLEANUP_INTERVAL` | `60000` | The same, for the memory model of idempotency. |
| `SOAJS_CACHE_CLEANUP_INTERVAL` | `60000` | The same, for the memory model of the cache. |
| `SOAJS_MONGO_CON_KEEPALIVE` | not set | Set: MongoDB connections stay open instead of closing after use. The Helm chart sets it. |
| `SOAJS_SOLO` | not set | `true`: read the registry and provisioning from a local file instead of MongoDB. For tests only. |

`SOAJS_REGISTRY_API` is not read by the gateway. Your services use it to reach the gateway's maintenance port (`<gateway host>:5000`) and load their registry from `/getRegistry`.

The gateway's own port is not an environment variable. It is `serviceConfig.ports.controller` in the [environment registry](/docs/gateway/environment-registry/#ports), 4000 in the default environment.

## Go gateway

### Docker

The image is `soajsorg/gateway-go`, tagged `4.4.29`, `4.x` and `latest`. It runs as a non-root user, and its entry point is the gateway, so no command is needed.

```bash
docker run --rm \
  -e SOAJS_ENV=dev \
  -e SOAJS_PROFILE=/opt/soajs/profile/soajsprofile \
  -v /path/to/soajsprofile:/opt/soajs/profile/soajsprofile:ro \
  -p 4000:4000 -p 5000:5000 \
  soajsorg/gateway-go:4.4.29
```

### From source

```bash
git clone https://github.com/soajs/soajs.controller.go
cd soajs.controller.go
make build    # bin/controller, needs Go 1.25 or later
SOAJS_ENV=dev SOAJS_PROFILE=/opt/soajs/profile/soajsprofile ./bin/controller
```

The repository also has a Kubernetes example in `deployments/kubernetes`.

### Environment variables

| Variable | Default | Description |
|---|---|---|
| `SOAJS_PROFILE` | required | The profile file, the same one the Node.js gateway reads. |
| `SOAJS_ENV` | `dev` | The environment whose registry is loaded. |
| `SOAJS_SERVICE_PORT` | `4000` | The gateway port. |
| `SOAJS_MAINTENANCE_PORT_INCREMENT` | `1001` | Maintenance port = gateway port + this. Used only when the registry has no `serviceConfig.ports.controller` and `maintenanceInc`. |
| `SOAJS_SERVICE_NAME`, `SOAJS_SERVICE_VERSION`, `SOAJS_SERVICE_GROUP` | `controller`, `1`, `Gateway` | The gateway's own service name: what `/soajs/acl` and `/soajs/mcp` are checked as. |
| `SOAJS_DEPLOY_HA` | not set | As for Node.js. With `kubernetes`, hosts are read from the Kubernetes API in the namespace of the registry's `deployer.container.kubernetes.namespace`. |
| `SOAJS_SRVIP` | the host's IPv4 | As for Node.js. |
| `SOAJS_SRV_AUTOREGISTERHOST` | not set | As for Node.js. |
| `SOAJS_MANUAL` | not set | As for Node.js. |
| `SOAJS_SENSITIVE_ENVS` | `["dashboard"]` | As for Node.js. |
| `SOAJS_SERVER_SHUTDOWN_TIMEOUT` | `10` | As for Node.js. |
| `SOAJS_MAX_INJECT_HEADER_SIZE` | `65536` | As for Node.js. |
| `SOAJS_MAX_BODY_SIZE`, `SOAJS_MAX_RESPONSE_SIZE` | `10485760` | As for Node.js. |
| `SOAJS_THROTTLE_CLEANUP_INTERVAL`, `SOAJS_IDEMPOTENCY_CLEANUP_INTERVAL`, `SOAJS_CACHE_CLEANUP_INTERVAL` | `60000` | As for Node.js. |
| `SOAJS_LOG_LEVEL` | `info` | `debug`, `info`, `warn` or `error`. |
| `SOAJS_LOG_FORMAT` | `json`, or `console` when `SOAJS_ENV` is `dev` | `console` for readable logs. |

The same settings can be written in a `config.yaml` (keys such as `service_port`, `log_level`, `maintenance.port_increment`), looked up in the working directory, `./configs` and `/etc/soajs/`. Environment variables take precedence. The repository's [config.example.yaml](https://github.com/soajs/soajs.controller.go/blob/main/configs/config.example.yaml) lists every key with its default.

The Go gateway does not read `SOAJS_MONGO_CON_KEEPALIVE` or `SOAJS_SOLO`. Its connections always stay open, and it always reads MongoDB.

## Ports

| | Node.js | Go |
|---|---|---|
| Gateway port | `serviceConfig.ports.controller` from the registry | `SOAJS_SERVICE_PORT` (4000) |
| Maintenance port | `serviceConfig.ports.controller` + `serviceConfig.ports.maintenanceInc` | the same; `SOAJS_SERVICE_PORT` + `SOAJS_MAINTENANCE_PORT_INCREMENT` when the registry has neither |

With the default environment record both gateways listen on 4000 and 5000. If you change `ports.controller` in the registry, set `SOAJS_SERVICE_PORT` to the same value for the Go gateway.

Keep the maintenance port inside the cluster. See [Routes](/docs/gateway/routes/#maintenance-port).

## Check it runs

```bash
curl http://localhost:5000/heartbeat
curl http://localhost:5000/awarenessStat
```

`/heartbeat` answers once the gateway is up. `/awarenessStat` lists the services the gateway knows and the health of their hosts.
