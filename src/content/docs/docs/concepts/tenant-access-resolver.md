---
title: Tenant access resolver
description: Give a group of users, such as a department of your app, access to a tenant without inviting them one by one. Your app answers who has access and with what packages.
sidebar:
  order: 4
---

A user normally reaches a tenant other than their own in one of two ways: they are **invited** (the tenant is in their `allowedTenants`, with the groups they get there), or a rule in the registry lets every user of their home tenant in. Both mean recording the access in URAC ahead of time.

A **tenant access resolver** lets your app decide instead. The tenant names a resolver, the resolver is an API of your app, and the gateway asks it, per user, whether they have access to the tenant and with what packages. Nothing is written on the users. Use it when the group is defined by your app, for example every user of a department, and changes there must apply right away.

## Requirements

| Package | Minimum version |
|---|---|
| `soajs.controller` | 4.3.18 |

## How it works

Users log in at their home tenant and switch tenants inside the app: they keep their token and call the gateway with the **key of the other tenant**. On each of those calls the gateway decides, in this order:

| Order | Condition | Result |
|---|---|---|
| 1 | The token's `allowedTenants` lists the tenant | Invited: URAC decides as before, your API is not called |
| 2 | The tenant profile names a resolver | Your API is called |
| 3 | Your API says no, fails or times out | URAC decides as before |

```
App (user of tenant HOME, switched to tenant DEPT)
   │  GET /orders/list   key: DEPT key   access_token: user's token
   ▼
Gateway ── token lists DEPT? ── yes ──► URAC (invitation)
   │ no
   │ DEPT profile names resolver "department"
   │── POST /tenant/access ──► your departments service
   │◄── access: true, groups, groupsConfig ──
   ▼
ACL from the packages you returned ──► /orders/list
```

On access, the gateway takes the user from the token, puts them on the tenant of the key with the groups you returned, and builds their ACL from the packages you returned. URAC is not read.

Your API is never called for the user's home tenant, for a token issued for that tenant, or for roaming.

## Step 1: Build the API

Add a route to a service of your app that is in the registry. The gateway calls the service **directly**, not through the gateway, so the route needs no package ACL. Keep it out of every ACL: its answer is trusted as is.

The gateway sends:

```json
{
  "user": {
    "id": "<user-id>",
    "username": "ann",
    "tenant": { "id": "<home-tenant-id>", "code": "HOME" }
  },
  "tenant": {
    "id": "<tenant-id>",
    "code": "DEPT",
    "main": { "id": "<main-tenant-id>", "code": "MAIN" }
  },
  "subject": "dept_1"
}
```

`tenant` is the tenant being switched to, `main` is only there for a sub-tenant, and `subject` comes from the tenant profile (step 3). The `soajsinjectobj` header carries the tenant, key and application of the request, so a service with `extKeyRequired` accepts the call. It carries no user and no ACL.

Answer with a standard SOAJS response:

```json
{
  "result": true,
  "data": {
    "access": true,
    "groups": ["member"],
    "groupsConfig": {
      "allowedPackages": { "PROD": ["PROD_USER"] }
    }
  }
}
```

```json
{ "result": true, "data": { "access": false } }
```

| Field | Required | Description |
|---|---|---|
| `access` | yes | `true` to grant access. |
| `groupsConfig.allowedPackages` | yes, with access | Package codes per product. Only the entry for the product of the tenant's key is used. |
| `groups` | no | Group codes services see on the user. `[]` when absent. |

The packages you return **are** the user's ACL under that tenant: nothing caps them. The packages themselves come from the gateway's provisioning cache.

The route runs on every call the user makes under the tenant, so keep it fast.

## Step 2: Add the resolver to the custom registry

In the custom registry of the environment, add (or edit) the entry named `urac`:

```json
{
  "name": "urac",
  "value": {
    "tenantAccessResolvers": {
      "department": {
        "service": "departments",
        "version": "1",
        "method": "post",
        "api": "/tenant/access",
        "timeout": 2000
      }
    }
  }
}
```

| Field | Default | Description |
|---|---|---|
| `service` | | Service that answers. It must be in the registry. |
| `version` | latest | Version of the service. |
| `method` | `post` | HTTP method. |
| `api` | | Route on the service, without the service name. |
| `timeout` | `2000` | Milliseconds before the call counts as no access. |

The key (`department`) is the resolver name that tenants refer to: keep it stable. The service, route and timeout can change later without touching any tenant.

## Step 3: Point the tenant at the resolver

On each tenant the group should reach, set `access` in the tenant profile, with multitenant `PUT /admin/tenant/profile?id=<tenant-id>` (or `PUT /tenant/profile` for the tenant of the key making the call):

```json
{
  "profile": {
    "access": {
      "resolver": "department",
      "subject": "dept_1"
    }
  }
}
```

`subject` is passed to your API as is, here the department id. The profile is loaded with the key, so a change applies once the gateway's key cache refreshes.

Both routes replace the whole profile. Whatever edits tenant profiles must keep `access`.

## Step 4: Check it

With users logged in at their home tenant, call an API of the tenant with their token and the tenant's key:

- A user of the group gets through, with the packages your API returned.
- A user outside the group gets error `146`, as before.
- A user invited to the tenant goes through the invitation, and your API is not called.

If a user of the group gets `146`, search the gateway logs for `Tenant access resolver`: every failed call is logged with the resolver, the user and the tenant.

## Failures

Anything but a well-formed yes counts as no access, and URAC decides as before:

| Case | Logged |
|---|---|
| Service not in the registry, or no host | yes |
| Non-2xx status, `result: false`, or a body that is not JSON | yes |
| No answer within `timeout` | yes |
| `access: true` without `groupsConfig.allowedPackages` | yes |
| `access` is not `true` | no, it is a normal answer |
| The tenant names a resolver that is not in the registry | yes, the tenant is treated as having none |

## Behaviour

- **Cost.** One call to your API per call under the tenant, in place of reading the user and groups from URAC. Invited users cost what they did before.
- **Freshness.** Nothing is cached: adding or removing a user in your app applies on their next call.
- **Outage.** While your service is down, users of the group get `146` under that tenant, each call after waiting up to `timeout`, so keep it short. Their home tenant and invited users are not affected, except users invited after their token was issued, who also wait for the timeout before URAC lets them in.
- **Invitations win.** A user who is both invited and in the group gets the groups of the invitation. An invitation made after the token was issued is not in the token yet: until their next login, the user gets what your API returns.

## Checklist

- Build the route in a service that is in the registry, and keep it out of every package ACL.
- Return `groupsConfig.allowedPackages` keyed by the product of the tenant's key.
- Add the resolver under `tenantAccessResolvers` in the `urac` custom registry of each environment, with a short `timeout`.
- Set `profile.access` on each tenant, and make sure whatever edits tenant profiles keeps it.
- Check a user in the group, a user outside it, and an invited user.

The gateway reference is [docs/tenant-access-resolver.md](https://github.com/soajs/soajs.controller/blob/master/docs/tenant-access-resolver.md) in `soajs.controller`.
