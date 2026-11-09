---
title: MCP for AI agents
description: Connect AI agents to your SOAJS services over MCP. Every service is a set of tools, filtered by each tenant's package and each user's ACL, and every tool call goes through the gateway like any API call.
sidebar:
  order: 5
---

AI agents connect to the gateway with the [Model Context Protocol](https://modelcontextprotocol.io) (MCP) at one endpoint, `POST /soajs/mcp`. They see the APIs their caller may use as **tools**, and a tool call is processed as the API call it stands for.

- **No MCP server to write.** Every SOAJS service already describes its APIs: a `soajs` service from its `config.js` schema, a service built with an SDK from its Swagger or OpenAPI document.
- **No second permission system.** The tools an agent sees come from the same tenant package and user ACL as your apps.
- **No new path around your rules.** A tool call goes through key, OAuth, device binding, the tenant access resolver, the ACL, rate limiting, idempotency and caching, then reaches the service like any other call.

## How it works

```
Agent (MCP client)
   │  POST /soajs/mcp     key + access token
   ▼
SOAJS gateway
   ├─ key, OAuth and user checks
   ├─ tools/list  → the caller's ACL
   │                + each allowed service's GET /mcp/tools, cached
   └─ tools/call  → the API call, with the caller's credentials,
                    through every gateway check → the service
```

## Requirements

| Component | Version |
|---|---|
| Gateway (`soajs.controller`) | 4.3.23; 4.3.26 for [agent sign-in](#let-agents-sign-in) and a key per tool call |
| Services built on `soajs` | 4.1.24: tools from `config.js`, nothing to add |
| Services built with `soajs.nodejs` | 2.0.4, with a Swagger / OpenAPI document ([Node.js SDK](/docs/sdks/nodejs/#mcp-tools)) |
| Services built with `soajs-python` | 1.0.1 ([Python SDK](/docs/sdks/python/#mcp-tools)) |
| Services built with `soajs.golang` | v1.0.5 ([Go SDK](/docs/sdks/go/#mcp-tools)) |

A service on an older version simply has no tools.

## Turn it on

MCP is off until you enable it in the `gateway` custom registry of the environment:

```json
{
  "mcp": {
    "enabled": true,
    "ttl": 300000,
    "timeout": 10000,
    "maxTools": 300
  }
}
```

| Field | Default | Description |
|---|---|---|
| `enabled` | — | `true` turns the endpoint on. Otherwise it answers 404 with error 190. |
| `ttl` | `300000` | How long the tools of a service are cached, in ms. |
| `timeout` | `10000` | Fetching tools and calling a tool, in ms. |
| `maxTools` | `300` | At most this many tools in a list. |

## Connect an agent

An agent needs the tenant's **external key** and a user's **access token**, like any client:

```json
{
  "mcpServers": {
    "soajs": {
      "url": "https://api.example.com/soajs/mcp",
      "headers": {
        "key": "<tenant external key>",
        "Authorization": "Bearer <access token>"
      }
    }
  }
}
```

For a client that only takes a URL, the key can go in the query string: `https://api.example.com/soajs/mcp?key=...`.

### Let agents sign in

From gateway 4.3.26, a client can connect with **only the URL**, using the MCP authorization flow (OAuth 2.1 with PKCE). The user adds the URL to Claude, Cursor or another MCP client. The client opens your sign-in page, a person approves, and the client receives its token. When the token expires, the same approval runs again.

The gateway is the protected resource; the authorization server (the consent page, codes and tokens) is yours, and you name its endpoints in the `mcp` registry entry:

```json
"auth": {
  "byProduct": {
    "AGENTS": {
      "authorization_endpoint": "https://portal.example.com/agents/authorize",
      "token_endpoint": "https://api.example.com/agents/oauth/token?key=<key>",
      "registration_endpoint": "https://api.example.com/agents/oauth/register?key=<key>"
    }
  },
  "byHost": { "api.client.example.com": { "...": "same fields" } },
  "default": { "...": "same fields" }
}
```

- **Which endpoints:** by the product of the key in the URL, else by the host the request came in on, else `default`. Each environment, and each domain, can point at its own sign-in page.
- **Without a valid token,** `/soajs/mcp` answers 401 with a `WWW-Authenticate` header that tells the client where to sign in. The gateway serves the discovery documents at `/.well-known/oauth-protected-resource` and `/.well-known/oauth-authorization-server/...`.
- **The key comes from the token.** Clients don't send a key. Issue a token restricted to the agent's tenant, product, package and key, for example with `soajs.oauth` `POST /restricted/token/guest`, and the gateway uses that key and checks the restrictions on every call.
- **Without `auth`,** nothing changes: clients send the key and token themselves.

### Give agents their own package

An agent sees every API its key's package and its user allow. To give agents a smaller set than your web app, for example no delete APIs, create an **application with its own key and package** in the tenant and give that key to the agent. The user's groups still narrow it further, as on every call.

## Which tools an agent sees

The gateway uses the same ACL as [`/soajs/acl`](/docs/concepts/access-control/): the user's ACL and packages, else the tenant application's, else the package's.

- For each service, the latest version the caller may use.
- A service in **restricted** mode shows only the APIs its ACL lists, per method, and none when it lists none.
- The gateway's own APIs are not tools.

Each tool has:

| Field | Value |
|---|---|
| `name` | `<service>_<operationId>` or `<service>_<method>_<path>`, for example `orders_get_list` |
| `description` | The API label, with `[service: METHOD /path]` |
| `inputSchema` | JSON Schema of the inputs: path, query and body fields in one object |
| `annotations` | `readOnlyHint` for GET, `destructiveHint` for DELETE |

## Tool calls

The gateway turns the arguments back into the path, the query string and the body, and calls the API through its own port with the caller's key, token, `device-id` and `user-agent`, and the client's IP. The answer's `data` becomes the tool result. An error from the gateway or the service, an ACL refusal for example, comes back as a tool error with its message.

Because the call is an ordinary API call:

- rate limits count agent calls like any other;
- each write gets its own idempotency key. A tool whose API has idempotency on takes an optional `_idempotencyKey` (UUID v4): an agent that retries with the same value does not run the call twice. From 4.3.26; the `Idempotency-Key` header of the MCP request is not passed on, since it would be the same for every call;
- cached GET answers are served from the cache;
- last-seen and monitoring record the call.

## Protocol

MCP over HTTP: JSON-RPC 2.0 on `POST /soajs/mcp`, one JSON answer per request, no session. The gateway supports `initialize`, `ping`, `tools/list` and `tools/call`, and the protocol versions `2025-06-18`, `2025-03-26` and `2024-11-05`.
