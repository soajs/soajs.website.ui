---
title: OAuth
description: Access and refresh tokens, login options (local, third-party, LDAP, OpenAM, phone, PIN) and token revocation in soajs.oauth.
sidebar:
  order: 1
---

The OAuth service (`soajs.oauth`, service name `oauth`, port 4002) issues, refreshes and revokes the access tokens the gateway validates on private APIs. It is called through the gateway like any other service, so every call carries the tenant's external key:

```
https://<your-api-domain>/oauth/<api>
```

The gateway validates tokens itself (the `oauth` step of the [pipeline](/docs/concepts/gateway/#middleware-pipeline)); services do not call `soajs.oauth` to check a token.

## Password grant

```bash
curl -X POST "https://<your-api-domain>/oauth/token" \
  -H "key: <your-ext-key>" \
  -H "Content-Type: application/json" \
  -d '{"username": "<username>", "password": "<password>", "grant_type": "password"}'
```

```json
{
  "token_type": "bearer",
  "access_token": "<access-token>",
  "expires_in": 7200,
  "refresh_token": "<refresh-token>"
}
```

If the request has no `Authorization` header, the service builds the client authorization from the tenant's OAuth settings. `GET /oauth/authorization` returns that value if a client needs it.

| Route | Description |
|---|---|
| `POST /token` | `grant_type` `password` (default) or `refresh_token`. |
| `POST /token/email` | Password grant, with the username or the email. |
| `POST /refresh/token` | Refresh with `refresh_token`. The used refresh token is deleted. |
| `GET /authorization` | Returns the client authorization header value for the tenant. |
| `GET /available/login` | Lists the login options enabled for the calling key (local and third-party). |

Send the access token to the gateway in the `access_token` header (or `?access_token=`):

```bash
curl "https://<your-api-domain>/orders/list" \
  -H "key: <your-ext-key>" \
  -H "access_token: <access-token>"
```

### Lifetimes and grants

The OAuth settings come from `serviceConfig.oauth` in the environment registry, with these defaults in `soajs.oauth`:

| Key | Default |
|---|---|
| `grants` | `["password", "refresh_token"]` |
| `accessTokenLifetime` | `7200` seconds |
| `refreshTokenLifetime` | `1209600` seconds (14 days) |
| `debug` | `false` |

### Turning local login off

Local (username and password) login can be disabled per key in the key configuration for `oauth`:

```json
{
  "oauth": {
    "local": {
      "available": false,
      "whitelist": ["<username>"]
    }
  }
}
```

With `available: false`, only usernames in `whitelist` can use the password grant; others get error `414` (Local login is not allowed).

## Third-party login

Passport strategies: `facebook`, `google`, `twitter`, `github`, `azure`, `linkedin`.

| Route | Description |
|---|---|
| `GET /passport/login/:strategy` | Starts the provider login. |
| `GET /passport/validate/:strategy` | Provider callback. Creates or updates the user in URAC and returns a token. |

Configure each strategy in the key configuration under `oauth.passportLogin.<strategy>`. Google and Azure AD read `clientID`, `clientSecret` and `callbackURL`; Azure AD also accepts `tenant`, `resource` and `useCommonEndpoint`. An optional `groups` array sets the URAC groups of users created through that strategy.

```json
{
  "oauth": {
    "passportLogin": {
      "google": {
        "clientID": "<client-id>",
        "clientSecret": "<client-secret>",
        "callbackURL": "https://<your-site>/callback/google",
        "groups": ["<group-code>"]
      }
    }
  }
}
```

### LDAP

`POST /ldap/login` with `username` and `password`. Configure under `oauth.ldapServer` in the key configuration: `host`, `port`, `baseDN`, `adminUser`, `adminPassword`.

### OpenAM

`POST /openam/login` with the OpenAM `token`. Configure under `oauth.openam` in the key configuration (`attributesURL`, `attributesMap`, `timeout`).

## Phone login

1. `POST /token/phone` with `phone` and `type` (`sms`, the default, or `whatsapp`). A verification code is created and sent through Twilio, configured in `servicesConfig.sms.twilio` / `sms.from` or in the `sms` custom registry entry.
2. `POST /token/phone/code` with `phone` and `code` returns the access token. Set `unique: true` to delete the user's other tokens.

The code lifetime defaults to two days. Override it with `oauth.tokenExpiryTTL` in the key configuration or in the `oauth` custom registry entry (milliseconds).

## PIN login

When a tenant enables PIN for a product (`pin.<product>.enabled` in the tenant OAuth settings), a token obtained with username and password only reaches:

- `POST /oauth/pin` (exchange the PIN for a PIN-logged-in token),
- the custom PIN route set in the `oauth` custom registry entry as `pinWrapper` (`servicename`, `apiname`),
- APIs listed in `pinWhitelist` in the same entry, per service and method (`apis`, `regex`).

Any other call returns `145` (You need to be logged in with pin to access this System).

## Server-to-server tokens

These routes are in API group `Internal`. Do not grant them in a package ACL; call them from your own services over `interConnect`.

| Route | Description |
|---|---|
| `POST /token/auto/:id` | Issues an access and refresh token for the URAC user `:id`. |
| `POST /restricted/token/auto/:id` | Issues a [restricted token](/docs/security/restricted-tokens/) for a user, with no refresh token. |
| `POST /restricted/token/guest` | Issues a restricted token for a guest identity with no URAC record, with no refresh token. |

## Revoking tokens

| Route | Description |
|---|---|
| `DELETE /accessToken/:token` | Deletes one access token. |
| `DELETE /refreshToken/:token` | Deletes one refresh token. |
| `DELETE /tokens/user/:userId` | Deletes all tokens of a user. |
| `DELETE /tokens/user/:userId/device/:deviceId` | Deletes a user's tokens on one device. |
| `DELETE /restricted/tokens/user/:userId` | Deletes a user's restricted tokens only. |
| `DELETE /tokens/tenant/:clientId` | Deletes all tokens of a tenant. |

## JWT mode

A tenant (or the environment `serviceConfig.oauth`) can set the OAuth `type` to `0`. The gateway then expects `Authorization: Bearer <jwt>` and verifies it with the tenant's OAuth `secret` (or `serviceConfig.oauth.secret`), the `algorithms` (default `["HS256"]`) and `audience` set in `serviceConfig.oauth`. An invalid or missing token returns `143`. Type `2` (the default) is the OAuth 2.0 token flow above.

## Error codes

| Code | Message |
|---|---|
| 400 | Business logic required data are missing. |
| 401 | Unable to log in. Credential error or mismatch |
| 403 | User does not have access to this tenant |
| 413 | Unable to log in. Credential error or mismatch |
| 414 | Local login is not allowed |
| 415 | You are not allowed to mint a token for another user |
| 416 | The minted user record is missing a required field |
| 417 | A reserved field was supplied in claims |
| 450 | You do not have privileges to enable pin login |
| 451 | Pin login is not available for this account |
| 599 | Token has expired. |
| 600 | Error in generating oAUth Token. |
| 700–705 | LDAP login errors |
| 710–713 | OpenAM login errors |
| 720 | Unable to authenticated with third party |

See also [Device binding](/docs/security/device-binding/) and [Restricted tokens](/docs/security/restricted-tokens/).
