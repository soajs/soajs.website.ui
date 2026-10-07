---
title: Device binding
description: Bind access and refresh tokens to the device-id header, and how to turn the gateway check off.
sidebar:
  order: 3
---

SOAJS can bind a token to the device that obtained it. The client sends a stable identifier in the `device-id` header; the OAuth service stores it on the token, and later calls must send the same value.

## How the device id is captured

When a client logs in, `soajs.oauth` copies the `device-id` request header onto the token's user record as `user.deviceId`. This applies to the password grant (`POST /token`, `POST /token/email`), PIN login (`POST /pin`), phone login (`POST /token/phone` then `POST /token/phone/code`), third-party login and `POST /token/auto/:id`.

[Restricted tokens](/docs/security/restricted-tokens/) are the exception: the device id comes from the `deviceId` body field, because the headers on that call belong to the calling service.

A client that sends no `device-id` header gets a token with no device id, and that token is not device-checked.

## Where it is enforced

| Where | Check | On mismatch |
|---|---|---|
| Gateway, every private API call | `user.deviceId` on the access token must equal the `device-id` header | error `156` (Device forbidden), HTTP 403 |
| OAuth service, refresh (`POST /token` with `grant_type=refresh_token`, `POST /refresh/token`) | `user.deviceId` on the refresh token must equal the `device-id` header | error `413`, and the refresh token is deleted |

Tokens issued before the device id was recorded, or without the header, carry no `deviceId` and pass both checks. They are bound the next time the client logs in with the header.

User-agent is not used for this check: mobile clients often include a build number in the user-agent, which changes with every release.

## Client requirements

- Generate one id per installation (or per browser) and keep it for as long as the session should live.
- Send it as the `device-id` header on login, on refresh, and on every API call.
- If the id changes, the existing tokens stop working with `156` (calls) or `413` (refresh); log the user in again.
- Browsers: add `device-id` to the allowed CORS headers of the environment (`serviceConfig.cors.headers`), otherwise the preflight fails.

```bash
curl "https://<your-api-domain>/orders/list" \
  -H "key: <your-ext-key>" \
  -H "access_token: <access-token>" \
  -H "device-id: <device-id>"
```

## Revoking a device

```
DELETE /oauth/tokens/user/:userId/device/:deviceId
```

Deletes the user's tokens issued for that device.

## Turning the gateway check off

The gateway check is on by default. To turn it off for an environment, set `deviceIdCheck` to `false` in the custom registry entry named **`gateway`**:

```json
{
  "oauth": {
    "deviceIdCheck": false
  }
}
```

Only the boolean `false` turns the check off; any other value, or a missing entry, leaves it on. This switch only affects the gateway check on API calls. The refresh-token check in the OAuth service has no switch.

:::note
Error `156` is also returned when an external key's `device` allow/deny list rejects the client's user-agent. See [Multi-tenancy](/docs/concepts/multitenancy/#key-restrictions).
:::
