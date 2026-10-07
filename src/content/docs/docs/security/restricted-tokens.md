---
title: Restricted tokens
description: Mint access tokens that only work for one tenant, product, key or environment, for cross-tenant QR and deep-link pairing.
sidebar:
  order: 2
---

A restricted token is an access token carrying a `restrictedTo` object. The gateway checks it on every call and refuses the token anywhere outside the scope it names. Restricted tokens have **no refresh token**.

The typical use is pairing: a user already signed in on a mobile app authorizes a web app that belongs to a **different tenant and product**, without signing in again. The mobile app scans a QR code (or follows a deep link), a service you write mints a token scoped to the web app, and the web app uses it.

## Requirements

| Package | Minimum version |
|---|---|
| `soajs.core.modules` | 5.2.21 |
| `soajs` | 4.1.23 |
| `soajs.controller` | 4.3.16 |
| `soajs.oauth` | 3.1.24 |

## Pairing flow

```
Web app (tenant B)          Your pairing service           Mobile app (tenant A, signed in)
       │  POST /pairing  (tenant B key,     │                          │
       │  deviceId + agent of the browser)  │                          │
       │──────────────────────────────────► │  store scope = tenant B  │
       │ ◄──────────── pairingId ────────── │  + product of the key    │
       │  show QR / deep link with pairingId│                          │
       │                                    │ ◄── POST /pairing/:id/authorize
       │                                    │     (tenant A key, user's access_token,
       │                                    │      device-id of the phone)
       │                                    │── POST /restricted/token/auto/:userId ──► oauth
       │                                    │◄──────────── access_token ───────────────
       │  GET /pairing/:id  (polling)       │                          │
       │──────────────────────────────────► │                          │
       │ ◄──────── access_token (once) ──── │                          │
       │
       │  API calls: tenant B key + access_token + device-id of the browser
       ▼
    gateway: token not expired, deviceId matches, restrictedTo matches the key
```

Your pairing service is a normal multi-tenant SOAJS service. The two halves of a pairing arrive under **different tenants** (the web app's key, then the mobile app's key), so the pairing store must be shared, not per tenant.

- At `POST /pairing`, the caller *is* the web app: `req.soajs.tenant.id` and `req.soajs.tenant.application.product` are the scope the token should be restricted to. Store them on the pairing, with the browser's device id and user-agent from the request body.
- At authorize, take the user id from `req.soajs.urac._id` (the gateway authenticated the mobile token), never from the request body.
- Grant the two public routes (open and poll) in the web app tenant's package ACL, and the authorize route as a private API in the mobile app's package.

## Mint API

```
POST /restricted/token/auto/:id
```

API group `Internal` in `soajs.oauth`. Call it from your service over `interConnect`, not through the gateway:

```js
// config.js of your service
"interConnect": [{ "name": "oauth" }]
```

```js
req.soajs.awareness.connect("oauth", (peer) => {
	// POST http://${peer.host}/restricted/token/auto/${req.soajs.urac._id}
	// forward peer.headers as-is: they carry soajsinjectobj, so oauth sees
	// the same tenant and user as your route
});
```

Without the `interConnect` entry, `awareness.connect` returns the gateway host instead, and the call takes a different path.

### Parameters

| Field | In | Required | Description |
|---|---|---|---|
| `id` | path | yes | URAC user id. |
| `restrictedTo` | body | yes | Where the token may be used. Unknown keys are rejected. |
| `deviceId` | body | no | The **web app's** device id. Omit it and the token is not device-bound. |
| `agent` | body | no | The web app's user-agent. Only enforced if `restrictedTo.agent` is also set. |
| `ttl` | body | no | Lifetime in seconds, minimum 60. Defaults to `accessTokenLifetime` (7200). |

`deviceId` and `agent` are body fields because on this call the `device-id` and `user-agent` headers belong to your service, not to the browser. Pass the values stored when the pairing was opened.

### `restrictedTo`

Each key takes a string or an array of strings. Only the keys present are checked, on every call.

| Key | Required | Checked against |
|---|---|---|
| `tenant` | yes | the tenant of the external key on the request |
| `product` | no | the product of that key's application |
| `package` | no | the package of that key's application |
| `key` | no | the external key itself |
| `env` | no | the gateway environment (`SOAJS_ENV`), case-insensitive |
| `agent` | no | the `user-agent` header, exact match |

```json
{
  "restrictedTo": {
    "tenant": "<web-app-tenant-id>",
    "product": "<web-app-product-code>"
  },
  "deviceId": "<browser-device-id>",
  "agent": "<browser-user-agent>",
  "ttl": 3600
}
```

Response:

```json
{
  "result": true,
  "data": {
    "token_type": "bearer",
    "access_token": "<access-token>",
    "expires_in": 3600
  }
}
```

The minted token has `loginMode` `oauth`, so the gateway takes the user straight from the token and does not look it up in the web app's tenant.

### Mint errors

| Code | Meaning |
|---|---|
| 400 | Required data missing. |
| 413 | User not found for `:id` in the calling tenant. |
| 415 | The call carries a user's own token and `:id` is a different user. |
| 416 | The user record is missing a required field (`username`, `tenant`, ...). |
| 600 | Token generation failed. |

## Using the token

Every call from the web app sends:

| Header | Value |
|---|---|
| `key` | The web app's external key. Its tenant, product, package and key are matched against `restrictedTo`. |
| `access_token` | The restricted token. |
| `device-id` | The same device id that was passed at mint. |
| `user-agent` | Sent by the browser. Only checked when `restrictedTo.agent` is set. |

Use the `access_token` header (or query parameter). Do not rely on `Authorization: Bearer` for restricted tokens: the gateway only normalizes the `access_token` header and query parameter, so a bearer header is not inspected on public APIs.

### What the gateway enforces

On every private call:

- the token exists and is not expired;
- `user.deviceId` on the token matches the `device-id` header, otherwise error `156`;
- every key in `restrictedTo` matches the request, otherwise error `147` (Token restriction mismatch);
- a restricted token reaching a service with `extKeyRequired: false` is refused with `147`, since there is no key to compare against.

There is no registry switch for the restriction check: it is always on for tokens that carry `restrictedTo`, and tokens without it are unaffected.

When the token stops working (`147`, `156`, or expiry), the client should start a new pairing, not retry. There is no refresh token.

## Revoking

```
DELETE /restricted/tokens/user/:userId
```

Deletes all restricted tokens of the user and leaves their other sessions in place. Returns the number deleted. To end a single browser session, keep the token and call `DELETE /accessToken/:token`.

## Guest tokens

```
POST /restricted/token/guest
```

Also group `Internal`. Mints a restricted token for an identity that has no URAC record: `username` and `tenant` (`{ "id", "code" }`) are required, `restrictedTo`, `deviceId`, `agent` and `ttl` work as above, and an optional `claims` object is copied onto the token's user. `claims` may not contain `_id`, `id`, `username`, `tenant`, `loginMode`, `guest`, `restrictedTo`, `deviceId` or `agent` (error `417`). The id is generated by the service. Anything that can reach this route can mint a token for any identity, so never grant it in a package ACL.

## Checklist

- Add `device-id` to `serviceConfig.cors.headers` in the environment registry, otherwise the browser preflight fails before the call reaches the gateway.
- Add `interConnect: [{ "name": "oauth" }]` to the pairing service.
- Make `pairingId` unguessable (CSPRNG, for example 32 random bytes), short-lived, single use, and bind the poll to the `device-id` that opened it.
- Rate limit the public poll route.
- Set `restrictedTo.tenant` to the **web app's** tenant, not the tenant of the authorize call.
- If APIs on the web app's product restrict access to groups, use the group codes of the user's own tenant; the token carries those groups (otherwise `160`).
- Keep `ttl` short when you set `restrictedTo.agent`: browser user-agents change on update and the match is exact.
