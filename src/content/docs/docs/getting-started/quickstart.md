---
title: Quickstart
description: Install SOAJS on Kubernetes with the soajs.helm charts.
sidebar:
  order: 1
---

This guide installs the SOAJS gateway, the core services and the console on a Kubernetes cluster using the charts in [soajs/soajs.helm](https://github.com/soajs/soajs.helm). Everything is installed in the `dashboard` environment, in the `soajs` namespace.

## Prerequisites

- A Kubernetes cluster and `kubectl` configured for it.
- Helm.
- Node.js, to run the key and password generator scripts in the chart repository.
- A clone of the chart repository:

```bash
git clone https://github.com/soajs/soajs.helm.git
cd soajs.helm
```

## 1. Create the namespace

```bash
kubectl apply -f ./scripts/namespace.yaml
```

If the SOAJS infra service will manage the cluster for you, the repository also ships `scripts/rbac.yaml`. Review it before applying it: it binds the `cluster-admin` role to the `default` service account of the `default` namespace, and it uses the `rbac.authorization.k8s.io/v1beta1` API, which current Kubernetes versions no longer serve (change it to `rbac.authorization.k8s.io/v1`).

## 2. Set your own values

All charts read the shared `values.yaml` at the root of the repository. The values committed there are examples. **Replace every credential, key and token with your own before installing**; never deploy the committed ones.

| Key | What to set |
|---|---|
| `global.soajsConfig.domain` | Your domain. |
| `global.soajsConfig.apiPrefix` | Subdomain of the API (the console calls `<apiPrefix>.<domain>`). |
| `global.soajsConfig.sitePrefix` | Subdomain of the console (`<sitePrefix>.<domain>`). |
| `global.soajsConfig.kubernetes.ipAddr`, `.port`, `.token` | API server address, port and a service account token for your cluster. They are seeded into the infra record used by the infra service. |
| `global.soajsConfig.user.username`, `.email` | The console owner account. |
| `global.soajsConfig.user.hashedPassword` | The bcrypt hash of the owner password (see below). |
| `global.soajsConfig.keyPassword` | The secret used to encrypt external keys in the `dashboard` environment. |
| `global.soajsConfig.tenantInternalKey`, `.tenantExternalKey` | The console tenant's internal and external key (see below). |
| `global.soajsConfig.mongo.servers` | MongoDB host(s). Leave the default to use the `soajs-mongo` chart. |
| `global.soajsNginxHttpPort`, `global.soajsNginxHttpsPort` | NodePorts used by `soajs-ui-bridge-np`. |
| `global.soajsDataExternalPort` | External port used by the MongoDB bridge charts. |
| `global.soajsDataPvcStorage` | Size of the MongoDB persistent volume claim. |

### Generate the owner password hash

Edit the `password` constant at the top of `scripts/pwdGenerator/index.js`, then run it. It prints the bcrypt hash to use as `hashedPassword`.

```bash
node scripts/pwdGenerator/index.js
```

### Generate the console tenant keys

Edit the `keyPassword` constant at the top of `scripts/keyGenerator/index.js` so it matches `global.soajsConfig.keyPassword`, then run it. It prints an internal key and an external key for the seeded console tenant and its `DSBRD_GUEST` package.

```bash
node scripts/keyGenerator/index.js
```

Both scripts require the `soajs` npm package to be resolvable.

## 3. Install the data layer

```bash
helm install soajs-data ./soajs-data/ --namespace soajs -f ./values.yaml
helm install soajs-data-claim ./soajs-data-claim/ --namespace soajs -f ./values.yaml
helm install soajs-mongo ./soajs-mongo/ --namespace soajs -f ./values.yaml
```

`soajs-data` holds the initial data (environment record, catalog, console tenant, owner user) as ConfigMaps. `soajs-mongo` runs MongoDB and imports that data on first boot.

To reach MongoDB from outside the cluster, optionally install one of the bridges:

```bash
helm install soajs-mongo-bridge ./soajs-mongo-bridge/ --namespace soajs -f ./values.yaml
# or, with a LoadBalancer service
helm install soajs-mongo-bridge ./soajs-mongo-bridge-lb/ --namespace soajs -f ./values.yaml
```

## 4. Install the gateway

Wait until MongoDB is ready, then:

```bash
helm install soajs-controller ./soajs-controller/ --namespace soajs -f ./values.yaml
```

## 5. Install the core services

Wait until the gateway is ready, then install each service:

```bash
helm install soajs-oauth ./soajs-oauth/ --namespace soajs -f ./values.yaml
helm install soajs-urac ./soajs-urac/ --namespace soajs -f ./values.yaml
helm install soajs-multitenant ./soajs-multitenant/ --namespace soajs -f ./values.yaml
helm install soajs-marketplace ./soajs-marketplace/ --namespace soajs -f ./values.yaml
helm install soajs-repositories ./soajs-repositories/ --namespace soajs -f ./values.yaml
helm install soajs-infra ./soajs-infra/ --namespace soajs -f ./values.yaml
helm install soajs-console ./soajs-console/ --namespace soajs -f ./values.yaml
```

## 6. Install the console UI

Wait until the gateway is ready, then install the UI, either without TLS:

```bash
helm install soajs-ui ./soajs-ui/ --namespace soajs -f ./values.yaml
```

or with TLS. Copy your certificate and key as `tls.crt` and `tls.key` into `soajs-ui-ssl/resources` first:

```bash
helm install soajs-ui ./soajs-ui-ssl/ --namespace soajs -f ./values.yaml
```

Expose it once the UI is ready, with a NodePort or a LoadBalancer:

```bash
helm install soajs-ui-bridge ./soajs-ui-bridge-np/ --namespace soajs -f ./values.yaml
# or
helm install soajs-ui-bridge ./soajs-ui-bridge-lb/ --namespace soajs -f ./values.yaml
```

Point `<sitePrefix>.<domain>` and `<apiPrefix>.<domain>` at the bridge and sign in to the console with the owner account you configured.

:::note
The chart repository README shows the Helm 2 form `helm install -name <release> ...`. The commands above use the Helm 3 form `helm install <release> <chart>`.
:::

## Check the gateway

Every SOAJS service exposes `/heartbeat` on its maintenance port, and the charts use it as the readiness probe. For the gateway the maintenance port is 5000:

```bash
kubectl -n soajs port-forward svc/dashboard-controller-v1-service 5000:5000
curl http://localhost:5000/heartbeat
```

## Remove everything

```bash
kubectl delete ns soajs
```

Next: [write your first service](/docs/getting-started/first-service/). See [Helm charts](/docs/deploy/helm/) for what each chart deploys.
