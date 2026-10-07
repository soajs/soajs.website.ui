---
title: Multi-tenancy
description: Tenants, applications, products, packages and external keys, and how the gateway uses them.
sidebar:
  order: 2
---

Every call through the SOAJS gateway is made on behalf of a **tenant**, through one of its **applications**, using an **external key**. The application is subscribed to a **package** of a **product**, and that package's ACL decides which services and APIs the call can reach.

```
Product ──► Package (ACL per environment)
                ▲
Tenant ──► Application ──► Internal key ──► External key(s) (one per environment)
```

These records are managed by the multitenant service (`soajs.multitenant`) and stored in the core provisioning database. The gateway caches them and reloads them on `/loadProvision`.

## Products and packages

A **product** groups the services you sell or expose together. A **package** is a level of access inside a product: it holds an ACL per environment.

| Field | Description |
|---|---|
| `code` | Product or package code. Alphanumeric, at least 4 characters. Package codes are prefixed with the product code (for example `DSBRD_GUEST` in product `DSBRD`). |
| `name`, `description` | Labels. |
| `acl` (package) | ACL per environment code, then per service, then per version. See [Access control](/docs/concepts/access-control/). |
| `scope` (product) | A product-level ACL scope, managed with `PUT /product/scope` and `PUT /product/scope/env`. |

Multitenant API (group `Product`): `POST /product`, `POST /product/package`, `PUT /product/package/acl/env`, `GET /products`, and others.

## Tenants

| Field | Description |
|---|---|
| `code` | Tenant code. Alphanumeric, at least 4 characters. |
| `name`, `description` | Labels. |
| `type` | `product` or `client`. A `client` tenant belongs to a main tenant (`mainTenant` when created); the main tenant's `id` and `code` are forwarded to services as `tenant.main`. |
| `profile` | Free-form object. Forwarded to services that set `tenant_Profile: true`. Updated with `PUT /tenant/profile`. |
| `oauth` | The tenant's OAuth settings: `secret`, `redirectURI`, `grants`, `disabled`, `type`, `loginMode`, `pin`. Updated with `PUT /tenant/oauth`. |
| `applications` | The tenant's subscriptions (below). |

A locked tenant is flagged `locked` and the flag is forwarded to services.

## Applications and keys

An **application** links a tenant to one `product` and `package`. Each application has one or more **internal keys**, and each internal key has:

- **External keys**, one or more per environment. An external key is what clients send in the `key` header. It is generated from the internal key, the tenant and the package, and encrypted with the environment's key password. Each external key has an `env`, an optional `expDate`, a `label`, and optional `device` and `geo` restrictions.
- A **configuration** object (`config`). The gateway forwards the `commonFields` entry plus the entry named after the target service to that service as `req.soajs.servicesConfig`. This is where per-tenant service settings live, for example the OAuth login options in `config.oauth` (see [OAuth](/docs/security/oauth/)).

Multitenant API (group `Tenant`): `POST /tenant/application`, `POST /tenant/application/key`, `POST /tenant/application/key/ext`, `PUT /tenant/application/key/config`, and others.

### Key restrictions

The `device` and `geo` objects on an external key restrict where the key can be used:

```json
{
  "geo": {
    "allow": ["10.0.0.0/8"],
    "deny": ["10.0.1.0/24"]
  },
  "device": {
    "allow": [{ "family": "Chrome" }],
    "deny": [{ "family": "IE" }]
  }
}
```

`geo` entries are IPs or CIDR ranges matched against the client IP; a mismatch returns error `155` (Geographic location forbidden). `device` entries are matched against the parsed `User-Agent` (`family`, `major`, `minor`, `patch`, `os`); a mismatch returns error `156` (Device forbidden). Deny lists are checked before allow lists. Both checks are skipped for IPs in the gateway's `mt.whitelist` when `whitelist.acl` is on.

## How the gateway resolves a call

1. **Key.** The `key` middleware decrypts the external key and loads the tenant, application and package. A key for another environment is rejected with `144`; a key that cannot be loaded with `148`; a missing package with `149`.
2. **ACL.** The ACL for the requested service is taken from the application if it has one, otherwise from the package. A service absent from it returns `154` (The service is not available in your current package).
3. **Required key.** For services with `extKeyRequired: true`, a request with no valid key returns `132` (A valid key is needed to access any API).
4. **Context.** The tenant, key, application and (if requested) package ACL are forwarded to the service in `soajsinjectobj`.

## Multi-tenant data

The gateway resolves and forwards the tenant; isolating data per tenant is up to each service, which reads `req.soajs.tenant.id` or `req.soajs.tenant.code` to select its data.
