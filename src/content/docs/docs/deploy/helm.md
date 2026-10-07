---
title: Helm charts
description: The soajs.helm charts, what each deploys, and how your own services are deployed afterwards.
sidebar:
  order: 1
---

[soajs/soajs.helm](https://github.com/soajs/soajs.helm) contains one chart per SOAJS component. All charts read a shared `values.yaml` at the repository root and deploy into the `dashboard` environment in the namespace set by `global.namespace` (default `soajs`). For the install order and the values to set, see the [Quickstart](/docs/getting-started/quickstart/).

## Charts

| Chart | Deploys | Image | Ports (service / maintenance) |
|---|---|---|---|
| `soajs-data` | ConfigMaps with the initial data and the import script | — | — |
| `soajs-data-claim` | PersistentVolumeClaim for MongoDB (`global.soajsDataPvcStorage`) | — | — |
| `soajs-mongo` | MongoDB, imports the initial data on first boot | `mongo:6.0` | 27017 |
| `soajs-mongo-bridge` / `soajs-mongo-bridge-lb` | Optional external access to MongoDB on `global.soajsDataExternalPort` (LoadBalancer for `-lb`) | — | — |
| `soajs-controller` | Gateway | `soajsorg/gateway` | 4000 / 5000 |
| `soajs-urac` | URAC (version 3) | `soajsorg/urac` | 4001 / 5001 |
| `soajs-oauth` | OAuth | `soajsorg/oauth` | 4002 / 5002 |
| `soajs-multitenant` | Multitenant | `soajsorg/multitenant` | 4004 / 5004 |
| `soajs-repositories` | Repositories | `soajsorg/repositories` | 4006 / 5006 |
| `soajs-marketplace` | Marketplace | `soajsorg/marketplace` | 4007 / 5007 |
| `soajs-infra` | Infra | `soajsorg/infra` | 4008 / 5008 |
| `soajs-console` | Console service | `soajsorg/console` | 4009 / 5009 |
| `soajs-ui` | Console UI as a DaemonSet, no TLS | `soajsorg/consoleui-nossl` | 80 / 443 |
| `soajs-ui-ssl` | Console UI as a DaemonSet, with TLS from `resources/tls.crt` and `resources/tls.key` | `soajsorg/consoleui` | 80 / 443 |
| `soajs-ui-bridge-np` / `soajs-ui-bridge-lb` | Exposes the UI with a NodePort (`global.soajsNginxHttpPort`, `global.soajsNginxHttpsPort`) or a LoadBalancer | — | — |

Each service image tag is the chart's `appVersion`.

## What a service chart looks like

Every SOAJS service chart creates a `Deployment` named `<label>-v<version>` and a `ClusterIP` service `<label>-v<version>-service` exposing the service and maintenance ports. The pod:

- runs `node .` in `/opt/soajs/soajs.<name>/`;
- sets `SOAJS_ENV=dashboard`, `SOAJS_DEPLOY_HA=kubernetes`, `SOAJS_PROFILE=/opt/soajs/profile/soajsprofile`, `SOAJS_MONGO_CON_KEEPALIVE=true` and `SOAJS_BCRYPT=true`;
- mounts the `soajsprofile` secret (the MongoDB connection profile, created by the `soajs-controller` chart);
- uses `GET /heartbeat` on the maintenance port as the readiness probe.

The pods carry `soajs.*` labels (`soajs.env.code`, `soajs.service.name`, `soajs.service.version`, `soajs.service.type`, ...) that the gateway uses to discover services in Kubernetes.

## Deploying your own services

Once the platform is running, your services are deployed from the console rather than with Helm:

1. **Add the repository** through the Repositories service. It reads [`soa.json`](/docs/deploy/soa-json/) (or `config.js`) from the repository and creates a catalog item in the Marketplace.
2. **Configure and deploy** the item through the Marketplace (`PUT /item/deploy/configure`, `PUT /item/deploy`). An item is deployed as a Kubernetes `Deployment`, `DaemonSet` or `CronJob`, from a catalog recipe.
3. The default catalog includes recipes for Node.js (`soajsorg/node`), Go (`soajsorg/go`) and Nginx front ends (`soajsorg/fe`). These images run **soajs.deployer**, which pulls your source from git at start-up and runs it.

### soajs.deployer

The deployer runs inside the image and is configured through environment variables:

| Variable | Description |
|---|---|
| `SOAJS_GIT_ACC_INFO` | JSON: git `provider`, `owner`, `domain` and access `token`. |
| `SOAJS_GIT_REPO_INFO` | JSON: `repo`, `branch`, `commit`. |
| `SOAJS_SRV_MAIN` | Node.js entry file (default `.`). |
| `SOAJS_SRV_MEMORY` | Node.js `max_old_space_size` in MB. |
| `SOAJS_ENV` | Environment code (default `dev`). |
| `SOAJS_REGISTRY_API` | Gateway maintenance `host:port`, needed for services behind the gateway. |
| `SOAJS_CONFIG_ACC_INFO`, `SOAJS_CONFIG_REPO_INFO` | Optional repository with extra configuration files. |
| `SOAJS_GATEWAY_CONFIG`, `SOAJS_SITES_CONFIG`, `SOAJS_SSL_CONFIG` | Nginx gateway, static sites and TLS settings for front-end images. |

Node.js code is placed in `/opt/soajs/node_modules/<repo>` and Go code in `/go/src/<repo>`.
