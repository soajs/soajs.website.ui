---
title: Introduction
description: What SOAJS is, how a request flows through it, and the core services that ship with it.
---

SOAJS is an open-source platform for building multi-tenant APIs. It is made of three parts:

- **A gateway** (`soajs.controller`) that every API call goes through. It resolves the tenant from the external key, applies the package ACL, validates the access token, enforces rate limits, and routes the call to the right microservice.
- **Core services** that provide multi-tenancy, users, OAuth 2.0, a service catalog and a management console.
- **A framework and SDKs** for writing services: the `soajs` Node.js framework (built on Express 5), plus middleware for Node.js, Go and Python services.

All SOAJS packages are licensed under Apache-2.0.

## How a request flows

```
client ──► gateway ──► key ──► ACL ──► oauth ──► route ──► your service
           (port 4000)   │       │        │         │
                         │       │        │         └─ host resolved through the
                         │       │        │            registry (awareness)
                         │       │        └─ access_token validated for private APIs
                         │       └─ product package ACL for this service/API
                         └─ external key ─► tenant, application, package
```

1. The client sends the request to the gateway with an external key (`key` header) and, for private APIs, an `access_token`.
2. The gateway loads the key from the provisioning database. The key identifies the **tenant**, the **application**, and the **product package** the application is subscribed to.
3. The package ACL decides whether this service, version and API are reachable, and whether the API is public or private.
4. For private APIs, the access token is validated and the user (URAC) is resolved.
5. The gateway looks up a healthy host for the service in the environment registry and proxies the request. Tenant, key, application and user information travel to the service in the `soajsinjectobj` header.

The full pipeline is described in [Gateway](/docs/concepts/gateway/).

## Core services

| Service | Package | Default port | Role |
|---|---|---|---|
| Gateway | `soajs.controller` | 4000 (maintenance 5000) | Multi-tenant API gateway with service awareness and an inter-connect mesh |
| URAC | `soajs.urac` | 4001 | User Registration and Access Control: users, groups and access levels per tenant |
| OAuth | `soajs.oauth` | 4002 | OAuth 2.0 tokens: issue, refresh and revoke; third-party and LDAP login |
| Multitenant | `soajs.multitenant` | 4004 | Tenants, applications, keys, products and packages |
| Repositories | `soajs.repositories` | 4006 | Integration with git providers; reads `soa.json` / `config.js` from repositories |
| Marketplace | `soajs.marketplace` | 4007 | Catalog of items (services, daemons, static sites, resources, custom) and their deployment |
| Infra | `soajs.infra` | 4008 | Kubernetes accounts, clusters and deployment operations |
| Console | `soajs.console` | 4009 | Environments, registry, custom registry, throttling and API analytics |
| Console UI | `soajsorg/consoleui` image | 80 / 443 | Web interface for the services above |

Ports are the values in each service's `config.js` and the Helm chart defaults. Maintenance ports are the data port plus the environment's `maintenanceInc` (1000 in the default environment record).

## Where to go next

- [Quickstart](/docs/getting-started/quickstart/): install SOAJS on Kubernetes with Helm.
- [Your first service](/docs/getting-started/first-service/): write a Node.js microservice and call it through the gateway.
- Concepts: [Gateway](/docs/concepts/gateway/), [Multi-tenancy](/docs/concepts/multitenancy/), [Access control](/docs/concepts/access-control/).
- Security: [OAuth](/docs/security/oauth/), [Restricted tokens](/docs/security/restricted-tokens/), [Device binding](/docs/security/device-binding/).
- Traffic: [Caching](/docs/traffic/caching/), [Idempotency](/docs/traffic/idempotency/), [Rate limiting](/docs/traffic/rate-limiting/).
- SDKs: [Node.js](/docs/sdks/nodejs/), [Go](/docs/sdks/go/), [Python](/docs/sdks/python/).
- Deploy: [Helm charts](/docs/deploy/helm/), [soa.json](/docs/deploy/soa-json/), [Go gateway (preview)](/docs/deploy/go-gateway/).
