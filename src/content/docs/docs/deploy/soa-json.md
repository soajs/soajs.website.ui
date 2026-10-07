---
title: soa.json
description: The soa.json descriptor that turns a git repository into a SOAJS catalog item, and its types.
sidebar:
  order: 2
---

When you add a git repository to SOAJS, the Repositories service reads a descriptor from the repository root and creates (or updates) a catalog item in the Marketplace. The item is what you then configure and deploy from the console.

## Which file is read

For each repository (or each folder of a `multi` repository), the Repositories service looks for, in order:

1. `soa.json`
2. `config.js` (a `soajs` service configuration; for `service` and `daemon` items, `serviceName`, `serviceGroup`, `serviceVersion` and `servicePort` are mapped to `name`, `group`, `version` and `port`)
3. `soa.js`

If none is found, the repository becomes an item of type `custom` named after the repository.

A Node.js service built with the `soajs` framework therefore does not need a `soa.json`: its `config.js` is enough.

## Types

| `type` | Use for | Required fields |
|---|---|---|
| `service` | A REST service behind the gateway | `name`, `group`, `description`, `port`, `version` |
| `daemon` | A background process with a maintenance port | `name`, `group`, `port`, `version` |
| `static` | A static site or front end | `name`, `group` |
| `config` | A configuration repository | `name`, `group` |
| `custom` | Anything else | `name` |
| `multi` | A repository holding several items, one per folder | `folders` |

A `type` that is not in this list is treated as `custom`. The Marketplace also has a `resource` item type, created through its API (`PUT /item/resource`) rather than from a repository.

How an item runs in Kubernetes (`Deployment`, `DaemonSet` or `CronJob`) is a deployment setting chosen when you deploy it, not a `soa.json` type.

## Service

```json
{
  "type": "service",
  "name": "orders",
  "group": "Shop",
  "description": "Order management API",
  "version": "1",
  "port": 4300,
  "requestTimeout": 30,
  "requestTimeoutRenewal": 5,
  "extKeyRequired": true,
  "oauth": true,
  "urac": true,
  "maintenance": {
    "readiness": "/heartbeat",
    "port": { "type": "maintenance" },
    "commands": [
      { "label": "Reload Registry", "path": "/reloadRegistry", "icon": "fas fa-undo" }
    ]
  },
  "interConnect": [
    { "name": "payment", "version": "1" }
  ],
  "prerequisites": { "cpu": "", "memory": "" },
  "tags": ["orders"],
  "program": ["shop"],
  "documentation": { "readme": "/README.md", "release": "/RELEASE.md" }
}
```

| Field | Type | Description |
|---|---|---|
| `name` | string | Service name; letters, digits, `-`, `_`, `.`. |
| `group` | string | Group shown in the console. |
| `description` | string | Required for services. |
| `version` | string | Service version. |
| `port` | integer | Data port. |
| `subType` | string | Optional sub-type (the core SOAJS services use `soajs`). |
| `extKeyRequired`, `oauth`, `urac`, `urac_Profile`, `urac_ACL`, `urac_Config`, `urac_GroupConfig`, `tenant_Profile`, `provision_ACL` | boolean | Gateway behavior for the service. See [Access control](/docs/concepts/access-control/#how-a-service-opts-in). |
| `requestTimeout`, `requestTimeoutRenewal` | integer | Gateway timeout settings. |
| `interConnect` | array | Services this one calls directly: `{ "name", "version" }`. |
| `maintenance.port.type` | string | Required when `maintenance` is set. The SOAJS services use `maintenance`. |
| `maintenance.port.value` | integer | Optional explicit value. |
| `maintenance.readiness` | string | Readiness path, usually `/heartbeat`. |
| `maintenance.commands` | array | Buttons in the console: `label`, `path`, `icon`. |
| `prerequisites` | object | `cpu` and `memory`. |
| `swaggerFilename` | string | Swagger file in the repository used for the API list. |
| `tags`, `attributes`, `program`, `tab`, `documentation` | | Catalog metadata. |

The item's API list comes from the swagger file if one is found, otherwise from the `schema` of a `config.js`.

## Daemon

```json
{
  "type": "daemon",
  "name": "reports",
  "group": "Shop",
  "version": "1",
  "port": 4310,
  "maintenance": {
    "readiness": "/heartbeat",
    "port": { "type": "maintenance" }
  },
  "jobs": ["dailyReport"]
}
```

Daemons have the same `port`, `version`, `maintenance`, `prerequisites` and metadata fields as services, plus an optional `jobs` list.

## Static

```json
{
  "type": "static",
  "name": "website",
  "group": "Application",
  "version": "1",
  "description": "Marketing site"
}
```

## Multi

```json
{
  "type": "multi",
  "folders": ["orders/", "reports/", "website/"]
}
```

Each folder is read as its own repository root (its own `soa.json` or `config.js`).
