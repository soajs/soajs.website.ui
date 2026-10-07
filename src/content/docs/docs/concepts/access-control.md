---
title: Access control
description: Package ACLs, public and private APIs, URAC users and groups, and how a service opts into oauth and urac.
sidebar:
  order: 3
---

Access to an API is decided by the gateway in two layers:

1. The **package ACL** of the calling key (or, for a logged-in user, the packages of the user's groups) decides whether the service and API are reachable, and whether the API is **public** or **private**.
2. For private APIs, a valid **access token** is required, and the ACL can restrict the API to specific **URAC groups**.

## Package ACL

A package holds one ACL per environment code. Inside an environment, the ACL is keyed by service name, then by service version:

```json
{
  "dashboard": {
    "urac": {
      "3": {
        "access": true,
        "apisPermission": "restricted",
        "get": {
          "apis": {
            "/password/forgot": { "access": false, "group": "My account guest" },
            "/user": { "access": true },
            "/admin/users": { "access": ["owner"] }
          }
        },
        "put": {
          "apis": {
            "/account": { "access": true }
          }
        }
      }
    }
  }
}
```

| Key | Level | Meaning |
|---|---|---|
| `access` | service version | `true`: APIs are private unless the API says `access: false`. An array of group codes: only users in one of those groups can call the service (`157` otherwise). `false` or absent: APIs are public unless the API says otherwise. |
| `apisPermission` | service version | `"restricted"`: only APIs listed under the method are allowed; any other API returns `159`. Without it, unlisted APIs are allowed. |
| `get`, `post`, `put`, `delete`, ... | service version | Per-method API lists. |
| `apis.<path>.access` | API | `false`: public. `true`: requires a logged-in user. An array of group codes: requires a logged-in user in one of those groups (`160` otherwise). |
| `apis.<path>.group` | API | Label used by the console. |

API paths are the paths declared by the service, including parameters (for example `/passport/login/:strategy`).

If the requested version is not in the ACL and no version was requested, the latest version present in the ACL is used. An ACL set on the application itself takes precedence over the package ACL.

### Public and private APIs

The gateway marks each request as public or private from the ACL. This flag drives several things:

| | Public API | Private API |
|---|---|---|
| Access token | not required | required when the service has `oauth: true` |
| Throttling strategy | `publicAPIStrategy` | `privateAPIStrategy` |
| Default cache scope | per tenant | per tenant and user |

### ACL error codes

| Code | Message |
|---|---|
| `154` | Access denied: The service is not available in your current package. |
| `157` | You do not belong to a group with access to this System. |
| `158` | You need to be logged in to access this System. |
| `159` | System api access is restricted. api is not in provision. |
| `160` | You do not belong to a group with access to this system API. |
| `161` | You need to be logged in to access this API. |

You can read the ACL that applies to a key (and user) from the gateway route `/soajs/acl`.

## URAC users and groups

URAC (`soajs.urac`) stores users, groups and their access per tenant.

A **group** has a `code` (alphanumeric, up to 20 characters), a `name`, a `description`, the `environments` it applies to, and the `packages` it grants per product:

```json
{
  "code": "admins",
  "name": "Administrators",
  "description": "Tenant administrators",
  "environments": ["DEV"],
  "packages": [
    { "product": "<product-code>", "packages": ["<package-code>"] }
  ]
}
```

Users belong to groups (`groups` on the user record, managed with `PUT /admin/user/groups`). Group codes are what ACL `access` arrays match against.

When a logged-in user's groups grant packages for the product of the calling key, the gateway loads those packages' ACLs, merges them, and uses the result **instead of** the key's ACL for that request. A user can therefore see more or fewer APIs than the anonymous key allows.

Main URAC APIs:

| Group | APIs |
|---|---|
| Guest join | `POST /join`, `GET /checkUsername`, `GET /validate/join` |
| My account | `GET /user/me`, `PUT /account`, `PUT /account/password`, `PUT /account/email` |
| User administration | `GET /admin/users`, `POST /admin/user`, `PUT /admin/user`, `PUT /admin/user/groups`, `PUT /admin/user/status` |
| Group administration | `GET /admin/groups`, `POST /admin/group`, `PUT /admin/group`, `DELETE /admin/group` |

## How a service opts in

A service declares in its `config.js` (or `soa.json`) what it needs from the gateway:

```js
module.exports = {
	"serviceName": "orders",
	"extKeyRequired": true,  // a valid external key is required, tenant context is forwarded
	"oauth": true,           // private APIs require a valid access token
	"urac": true,            // forward the logged-in user as req.soajs.urac
	"urac_Profile": true,    // also forward the user profile
	"urac_ACL": false,
	"urac_Config": false,
	"urac_GroupConfig": false,
	"tenant_Profile": false,
	"provision_ACL": false
	// ...
};
```

- `extKeyRequired: false` lets calls through without a key. There is then no tenant context and no package ACL check.
- `oauth: false` skips token validation for the service. The `soajs` framework defaults `oauth` to `true` when it is not set.
- `urac: true` is needed to read the user in the service. Without it, `req.soajs.urac` is not populated even when a token is sent.

In the service, the logged-in user is then available as:

```js
service.get("/orders", (req, res) => {
	const user = req.soajs.urac;   // _id, username, firstName, lastName, email, groups, tenant, ...
	// ...
});
```

## Whitelisting internal callers

The custom registry entry `gateway` can let trusted networks skip ACL and/or OAuth checks:

```json
{
  "mt": {
    "whitelist": {
      "ips": ["10.0.0.0/8"],
      "acl": true,
      "oauth": true
    }
  }
}
```

| Key | Description |
|---|---|
| `ips` | IPs or CIDR ranges. |
| `acl` | When `true`, matching IPs skip the geo, device, service and API checks. |
| `oauth` | When `true`, matching IPs skip access token validation. |
