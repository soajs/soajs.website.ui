---
title: Python
description: Run FastAPI, Starlette, Flask or Django services behind the SOAJS gateway with soajs-python.
sidebar:
  order: 3
---

`soajs-python` (version 1.0.0, Python 3.9+) provides a thread-safe registry manager and middleware that decodes the gateway's `soajsinjectobj` header into a typed context. It has an ASGI middleware for FastAPI and Starlette, and a WSGI middleware for Flask and Django.

## Install

```bash
pip install soajs-python

# with framework extras
pip install "soajs-python[fastapi]"
pip install "soajs-python[flask]"
pip install "soajs-python[django]"
```

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `SOAJS_REGISTRY_API` | yes | `hostname:port` of the gateway maintenance port, for example `localhost:5000`. |
| `SOAJS_ENV` | yes | Environment code. |
| `SOAJS_DEPLOY_MANUAL` | no | `true` registers the service with the gateway on startup. Default `false`. |

## Registry manager

```python
from soajs import RegistryManager

registry = RegistryManager(
    service_name="orders",
    env_code="dev",
    service_type="service",
    auto_reload=True,
    # needed when SOAJS_DEPLOY_MANUAL=true:
    service_port=4300,
    service_group="Shop",
    service_version="1",
    service_ip="127.0.0.1",   # optional, defaults to 127.0.0.1
)

db = registry.get_database("orders")
dbs = registry.get_all_databases()
svc = registry.get_service("payment")
res = registry.get_resource("cache")
one = registry.get_custom("myconfig")   # raises CustomNotFoundError if absent
all_custom = registry.get_custom()
registry.reload()
registry.stop()                          # stop the auto-reload thread
```

`RegistryManager` can also be used as a context manager.

## FastAPI / Starlette

```python
from fastapi import FastAPI, Request
from soajs import RegistryManager
from soajs.middleware import SOAJSMiddleware

registry = RegistryManager(service_name="orders", env_code="dev", service_type="service")

app = FastAPI()
app.add_middleware(SOAJSMiddleware, registry=registry)

@app.get("/list")
async def list_orders(request: Request):
    context = request.scope.get("soajs")
    if context is None:
        return {"error": "No SOAJS context"}
    return {"tenant": context.tenant.code}
```

The ASGI middleware stores the context in `request.scope["soajs"]` when the header is present.

:::caution
In `soajs-python` 1.0.0, the helper `get_soajs_context(request)` reads the scope with `getattr` instead of a dictionary lookup and returns `None` even when the context is set. Read `request.scope.get("soajs")` directly, as above.
:::

## Flask

```python
from flask import Flask, request, jsonify
from soajs import RegistryManager
from soajs.middleware import SOAJSWSGIMiddleware

registry = RegistryManager(service_name="orders", env_code="dev", service_type="service")

app = Flask(__name__)
app.wsgi_app = SOAJSWSGIMiddleware(app.wsgi_app, registry)

@app.route("/list")
def list_orders():
    context = request.environ.get("soajs.context")
    if context is None:
        return jsonify({"error": "No SOAJS context"})
    return jsonify({"tenant": context.tenant.code})
```

## Django

The WSGI middleware wraps any WSGI application. Wrap the Django application in `wsgi.py`; the context is then available as `request.META.get("soajs.context")`:

```python
# wsgi.py
from django.core.wsgi import get_wsgi_application
from soajs import RegistryManager
from soajs.middleware import SOAJSWSGIMiddleware

registry = RegistryManager(service_name="orders", env_code="dev", service_type="service")
application = SOAJSWSGIMiddleware(get_wsgi_application(), registry)
```

## Context

| Attribute | Content |
|---|---|
| `tenant` | Tenant id, code, keys, application. |
| `urac` | The logged-in user, when forwarded. |
| `services_config` | Configuration stored on the tenant key. |
| `device`, `geo` | Device and geo information. |
| `awareness` | Gateway host and port, and the `inter_connect` list. |
| `registry` | The registry. |

## Calling other services

```python
from soajs.middleware import ServiceConnector
import httpx

connector = ServiceConnector(context)
conn = connector.connect("payment", version="1")
response = httpx.get(f"http://{conn.host}/charges", headers=conn.headers)
```

If the target is in the request's inter-connect list, `conn.host` points at it directly and the headers carry the SOAJS context. Otherwise `conn.host` is the gateway path for the service and the headers carry the caller's external key.

## Configuration validation

`soajs.Config` validates a service descriptor with the same fields as [`soa.json`](/docs/deploy/soa-json/):

```python
from soajs import Config

config = Config(
    name="orders",
    group="Shop",
    port=4300,
    version="1",
    type="service",
    maintenance={"port": {"type": "maintenance"}, "readiness": "/heartbeat"},
)
```

The repository's `examples/` directory has a FastAPI and a Flask example.
