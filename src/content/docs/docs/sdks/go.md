---
title: Go
description: Run a Go HTTP service behind the SOAJS gateway with the soajs.golang middleware.
sidebar:
  order: 2
---

`github.com/soajs/soajs.golang` loads the environment registry from the gateway, keeps it reloaded, and decodes the gateway's `soajsinjectobj` header into a context value on every request. It works with `net/http` handlers and anything that accepts them (the repository has a Gin example).

Requires Go 1.21 or later.

## Install

```bash
go get github.com/soajs/soajs.golang
```

## Minimal service

```go
package main

import (
	"context"
	"log"
	"net/http"

	soajsgo "github.com/soajs/soajs.golang"
)

func main() {
	ctx := context.Background()

	// serviceName, envCode, serviceType, autoReload
	registry, err := soajsgo.New(ctx, "orders", "dev", "service", true)
	if err != nil {
		log.Fatal(err)
	}

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		soa, ok := r.Context().Value(soajsgo.SoajsKey).(soajsgo.ContextData)
		if !ok {
			http.Error(w, "missing SOAJS context", http.StatusBadRequest)
			return
		}
		w.Write([]byte("tenant " + soa.Tenant.Code))
	})

	http.Handle("/", registry.Middleware(handler))
	log.Fatal(http.ListenAndServe(":4300", nil))
}
```

`registry.Middleware` decodes the `soajsinjectobj` header. When the header is missing or cannot be decoded, it calls the next handler without setting the context value, so check the type assertion as above rather than assuming the value is present.

## Environment variables

| Variable | Description |
|---|---|
| `SOAJS_REGISTRY_API` | `hostname:port` of the gateway maintenance port, for example `controller:5000`. No scheme. |
| `SOAJS_ENV` | Environment code. Required by `NewFromConfig`. |
| `SOAJS_DEPLOY_MANUAL` | When `true`, `NewFromConfig` registers the service with the gateway. |

## Registering from a configuration

`NewFromConfig` validates a `Config`, loads the registry for `SOAJS_ENV` with auto-reload on, and registers the service when `SOAJS_DEPLOY_MANUAL` is `true`:

```go
cfg := soajsgo.Config{
	ServiceName:    "orders",
	ServiceGroup:   "Shop",
	ServicePort:    4300,
	Type:           "service",
	ServiceVersion: "1",
	ExtKeyRequired: true,
	Oauth:          true,
	Urac:           true,
}
cfg.Maintenance.Readiness = "/heartbeat"
cfg.Maintenance.Port.Type = "maintenance"

registry, err := soajsgo.NewFromConfig(ctx, cfg)
```

`Validate` requires `Type`, `ServiceName`, `ServicePort`, `ServiceVersion` (`1` or `1.1` format), `ServiceGroup`, `Maintenance.Readiness` and `Maintenance.Port.Type`. The `Config` JSON tags match the [`soa.json`](/docs/deploy/soa-json/) fields (`name`, `group`, `port`, `version`, `type`, `maintenance`, `interConnect`, ...), so you can also unmarshal your `soa.json` into it.

## Request context

```go
soa, ok := r.Context().Value(soajsgo.SoajsKey).(soajsgo.ContextData)
```

| Field | Content |
|---|---|
| `Tenant` | Tenant id, code, key, application. |
| `Urac` | The logged-in user, when forwarded. |
| `ServicesConfig` | Configuration stored on the tenant key. |
| `Device`, `Geo` | Device and geo information. |
| `Awareness` | Gateway host and port, and `InterConnect` hosts. |
| `Reg` | The registry. |

## Registry

```go
db, err := registry.Database("orders")    // db.Prefix, db.Servers, ...
dbs, err := registry.Databases()
svc, err := registry.Service("payment")   // svc.Port, ...
res, err := registry.Resource("cache")
one, err := registry.GetCustom("myconfig") // *soajsgo.CustomRegistry
all, err := registry.GetCustom("")         // soajsgo.CustomRegistries
err = registry.Reload()
```

With auto-reload on, the registry reloads on the interval in `serviceConfig.awareness.autoReloadRegistry` (milliseconds, minimum one second), or every hour if it is not set.

## Calling other services

```go
conn := soa.Connect("payment", "1")
// conn.Host, conn.Headers.Key, conn.Headers.AccessToken, conn.Headers.SoajsInjectobj
```

If the target is in the request's `InterConnect` list, `Host` points at it directly (version match, or the latest version when no version is given) and `Headers.SoajsInjectobj` carries the caller's context. Otherwise the call goes through the gateway.

## Examples

The repository's `examples/` directory has a `net/http` service (`basic_service.go`) and a Gin service (`gin_service.go`).
