# Error responses

Error responses contain an `error` property which is a standard
[RFC 7807](https://tools.ietf.org/rfc/rfc7807.txt) object with the following
properties:
  - `type` `{string}`: [error type](#error-types)
  - `title` `{string}`: short description
  - `description` `{string}`: detailed description
  - `status` `{string}`: `CLIENT_ERROR` or `SERVER_ERROR`
  - `instance` `{string}`: URL path that was called
  - additional properties might be present, depending on the
    [error type](#error-types). See below for the list of additional properties
    for each [error type](#error-types).

`metadata.info` includes the same information as the
[`log` parameter](../../server/configuration/functions.md#parameters), providing
debugging information about the request.

```json
{
  "error": {
    "type": "NOT_FOUND",
    "title": "Some database models could not be found, e.g. the ids were invalid",
    "description": "The 'users' model with 'id' '20' could not be found",
    "status": "CLIENT_ERROR",
    "instance": "/rest/users/"
  },
  "metadata": {
    "requestid": "56ca9a87-73cc-48db-95fa-ec62e2dee812",
    "duration": 15,
    "info": {
      "timestamp": "2017-12-05T17:05:45.806Z",
      "protocol": "http",
      "ip": "127.0.0.1",
      "origin": "http://localhost:5001",
      "path": "/rest/users/",
      "method": "PUT",
      "status": "CLIENT_ERROR",
      "queryvars": {},
      "headers": {},
      "format": "json",
      "charset": "utf-8",
      "compress": "identity,identity",
      "payload": [
        { "id": "20" },
        { "id": "21" }
      ],
      "payloadsize": 105,
      "payloadcount": 2,
      "rpc": "rest",
      "args": {
        "data": [
          { "id": "20", "name": "Anthony" },
          { "id": "21", "name": "David" }
        ]
      },
      "params": {},
      "datasize": 105,
      "datacount": 2,
      "summary": "users{location}",
      "commandpaths": ["", "location"],
      "commandpath": "",
      "collections": ["users", "geolocation"],
      "collection": "users",
      "command": "upsert",
      "responsedata": {},
      "responsedatasize": 170,
      "responsetype": "error"
    }
  }
}
```

# Error types

Each error response has an associated type. Each error type has a specific
[title](#error-responses),
[HTTP status code](../protocols/http.md#error-responses),
[JSON-RPC error code](../rpc/jsonrpc.md#error-responses) and optionally some
error-specific [additional properties](#error-responses).

[Client-side errors](#client-side-errors):
  - [`VALIDATION`](#validation): the request syntax or semantics is invalid.
  - [`AUTHORIZATION`](#authorization): the request is not
    [authorized](../../server/data_model/authorization.md), i.e. not allowed to
    be performed.
  - [`ROUTE`](#route): the URL or route is invalid.
  - [`NOT_FOUND`](#not_found): some database models could not be found,
    e.g. the `id`s were invalid.
  - [`METHOD`](#method): the [protocol](../protocols/README.md) method is
    unknown or invalid.
  - [`COMMAND`](#command): the [command](../arguments/README.md#rpc) name is
    unknown or invalid.
  - [`RESPONSE_NEGOTIATION`](#response_negotiation): the response could not be
    serialized or [content negotiation](../protocols/formats.md) failed.
  - [`TIMEOUT`](#timeout): the request took
    [too much time](../../server/quality/limits.md#system-limits) to process.
  - [`CONFLICT`](#conflict): another client updated the same model, resulting
    in a conflict.
  - [`NO_CONTENT_LENGTH`](#no_content_length): the request payload's length
    must be specified.
  - [`PAYLOAD_LIMIT`](#payload_limit): the request payload is
    [too big](../../server/quality/limits.md).
  - [`URL_LIMIT`](#url_limit): the URL is
    [too big](../../server/quality/limits.md).
  - [`PAYLOAD_NEGOTIATION`](#payload_negotiation): the request payload could
    not be loaded, parsed or [content negotiation](../protocols/formats.md)
    failed.

[Server-side errors](#server-side-errors):
  - [`CONFIG_VALIDATION`](#config_validation): wrong
    [configuration](../../server/configuration/README.md) caught during
    server startup.
  - [`CONFIG_RUNTIME`](#config_runtime): wrong
    [configuration](../../server/configuration/README.md) caught runtime.
  - [`FORMAT`](#format): internal error related to a specific
    [format](../protocols/formats.md) adapter.
  - [`CHARSET`](#charset): internal error related to a specific
    [charset](../protocols/formats.md#charsets) adapter.
  - [`PROTOCOL`](#protocol): internal error related to a specific
    [protocol](../protocols/README.md) adapter.
  - [`RPC`](#rpc): internal error related to a specific [rpc](../rpc/README.md)
    adapter.
  - [`DATABASE`](#database): internal error related to a specific
    [database](../../server/databases/README.md) adapter.
  - [`LOG`](#log): internal error related to a specific
    [log provider](../../server/quality/logging.md#providers).
  - [`COMPRESS`](#compress): internal error related to a specific
    [compress](../arguments/compression.md) adapter.
  - [`PLUGIN`](#plugin): internal error related to a specific
    [plugin](../../server/plugins/README.md).
  - [`ENGINE`](#engine): internal engine error.
  - [`UNKNOWN`](#unknown): internal uncaught error.

## Client-side errors

### `VALIDATION`

The request syntax or semantics is invalid.

[_HTTP status code_](../protocols/http.md#error-responses): `400`

[_JSON-RPC error code_](../rpc/jsonrpc.md#error-responses): `-32602`

[_Additional properties_](#error-responses):
  - kind `{string}`: kind of validation errors. Can be:
    - `feature`: the collection does not support a specific feature used in the
      request
    - `protocol`: syntax error related to the [protocol](../protocols/README.md)
    - `rpc`: syntax error related to the [RPC system](../rpc/README.md)
    - `argument`: syntax error related to one [argument](../arguments/README.md)
    - `data`: syntax error related to the
      [`data` argument](../request/crud.md#create-command)
    - `constraint`: the `data` argument does not validate against
      [some constraint](../../server/data_model/validation.md)
  - path 'VARR'
  - value VAL
  - model OBJ
  - suggestions VAL_ARR

```json
{
  "type": "VALIDATION",
  "title": "The request syntax or semantics is invalid",
  "description": "",
  "status": "CLIENT_ERROR",
  "instance": "/rest/users/"
}
```

### `AUTHORIZATION`

The request is not [authorized](../../server/data_model/authorization.md), i.e.
not allowed to be performed.

[_HTTP status code_](../protocols/http.md#error-responses): `403`

[_JSON-RPC error code_](../rpc/jsonrpc.md#error-responses): `1`

[_Additional properties_](#error-responses):
  - collection STR
  - ids STR_ARR

```json
{
  "type": "AUTHORIZATION",
  "title": "The request is not authorized, i.e. not allowed to be performed",
  "description": "",
  "status": "CLIENT_ERROR",
  "instance": "/rest/users/"
}
```

### `ROUTE`

The URL or route is invalid.

[_HTTP status code_](../protocols/http.md#error-responses): `404`

[_JSON-RPC error code_](../rpc/jsonrpc.md#error-responses): `-32601`

[_Additional properties_](#error-responses):
  - suggestions VAL_ARR

```json
{
  "type": "ROUTE",
  "title": "The URL or route is invalid",
  "description": "",
  "status": "CLIENT_ERROR",
  "instance": "/rest/users/"
}
```

### `NOT_FOUND`

Some database models could not be found, e.g. the `id`s were invalid.

[_HTTP status code_](../protocols/http.md#error-responses): `404`

[_JSON-RPC error code_](../rpc/jsonrpc.md#error-responses): `1`

[_Additional properties_](#error-responses):
  - collection STR
  - ids STR_ARR

```json
{
  "type": "NOT_FOUND",
  "title": "Some database models could not be found, e.g. the ids were invalid",
  "description": "",
  "status": "CLIENT_ERROR",
  "instance": "/rest/users/"
}
```

### `METHOD`

The [protocol](../protocols/README.md) method is unknown or invalid.

[_HTTP status code_](../protocols/http.md#error-responses): `405`

[_JSON-RPC error code_](../rpc/jsonrpc.md#error-responses): `-32601`

[_Additional properties_](#error-responses):
  - suggestions STR_ARR

```json
{
  "type": "METHOD",
  "title": "The protocol method is unknown or invalid",
  "description": "",
  "status": "CLIENT_ERROR",
  "instance": "/rest/users/"
}
```

### `COMMAND`

The [command](../arguments/README.md#rpc) name is unknown or invalid.

[_HTTP status code_](../protocols/http.md#error-responses): `405`

[_JSON-RPC error code_](../rpc/jsonrpc.md#error-responses): `-32601`

[_Additional properties_](#error-responses):
  - suggestions STR_ARR

```json
{
  "type": "COMMAND",
  "title": "The command name is unknown or invalid",
  "description": "",
  "status": "CLIENT_ERROR",
  "instance": "/rest/users/"
}
```

### `RESPONSE_NEGOTIATION`

The response could not be serialized or
[content negotiation](../protocols/formats.md) failed.

[_HTTP status code_](../protocols/http.md#error-responses): `406`

[_JSON-RPC error code_](../rpc/jsonrpc.md#error-responses): `-32600`

[_Additional properties_](#error-responses):
  - kind 'compress|charset|format'
  - suggestions VAL_ARR

```json
{
  "type": "RESPONSE_NEGOTIATION",
  "title": "The response could not be serialized or content negotiation failed",
  "description": "",
  "status": "CLIENT_ERROR",
  "instance": "/rest/users/"
}
```

### `TIMEOUT`

The request took [too much time](../../server/quality/limits.md#system-limits)
to process.

[_HTTP status code_](../protocols/http.md#error-responses): `408`

[_JSON-RPC error code_](../rpc/jsonrpc.md#error-responses): `1`

[_Additional properties_](#error-responses):
  - limit NUM

```json
{
  "type": "TIMEOUT",
  "title": "The request took too much time to process",
  "description": "",
  "status": "CLIENT_ERROR",
  "instance": "/rest/users/"
}
```

### `CONFLICT`

Another client updated the same model, resulting in a conflict.

[_HTTP status code_](../protocols/http.md#error-responses): `409`

[_JSON-RPC error code_](../rpc/jsonrpc.md#error-responses): `1`

[_Additional properties_](#error-responses):
  - collection STR
  - ids STR_ARR

```json
{
  "type": "CONFLICT",
  "title": "Another client updated the same model, resulting in a conflict",
  "description": "",
  "status": "CLIENT_ERROR",
  "instance": "/rest/users/"
}
```

### `NO_CONTENT_LENGTH`

The request payload's length must be specified.

[_HTTP status code_](../protocols/http.md#error-responses): `411`

[_JSON-RPC error code_](../rpc/jsonrpc.md#error-responses): `-32600`

```json
{
  "type": "NO_CONTENT_LENGTH",
  "title": "The request payload's length must be specified",
  "description": "",
  "status": "CLIENT_ERROR",
  "instance": "/rest/users/"
}
```

### `PAYLOAD_LIMIT`

The request payload is [too big](../../server/quality/limits.md).

[_HTTP status code_](../protocols/http.md#error-responses): `413`

[_JSON-RPC error code_](../rpc/jsonrpc.md#error-responses): `-32600`

[_Additional properties_](#error-responses):
  - kind 'size|models|commands|depth'
  - value NUM
  - limit NUM

```json
{
  "type": "PAYLOAD_LIMIT",
  "title": "The request payload is too big",
  "description": "",
  "status": "CLIENT_ERROR",
  "instance": "/rest/users/"
}
```

### `URL_LIMIT`

The URL is [too big](../../server/quality/limits.md).

[_HTTP status code_](../protocols/http.md#error-responses): `414`

[_JSON-RPC error code_](../rpc/jsonrpc.md#error-responses): `-32600`

[_Additional properties_](#error-responses):
  - value NUM
  - limit NUM

```json
{
  "type": "URL_LIMIT",
  "title": "The URL is too big",
  "description": "",
  "status": "CLIENT_ERROR",
  "instance": "/rest/users/"
}
```

### `PAYLOAD_NEGOTIATION`

The request payload could not be loaded, parsed or
[content negotiation](../protocols/formats.md) failed.

[_HTTP status code_](../protocols/http.md#error-responses): `415`

[_JSON-RPC error code_](../rpc/jsonrpc.md#error-responses): `-32700`

[_Additional properties_](#error-responses):
  - kind 'parse|compress|charset|format'
  - suggestions VAL_ARR

```json
{
  "type": "PAYLOAD_NEGOTIATION",
  "title": "The request payload could not be loaded, parsed or content negotiation failed",
  "description": "",
  "status": "CLIENT_ERROR",
  "instance": "/rest/users/"
}
```

## Server-side errors

### `CONFIG_VALIDATION`

Wrong [configuration](../../server/configuration/README.md) caught during
server startup.

[_HTTP status code_](../protocols/http.md#error-responses): none. It is thrown
during server startup.

[_JSON-RPC error code_](../rpc/jsonrpc.md#error-responses): `-32603`

[_Additional properties_](#error-responses):
  - path `{string}`: path to the invalid configuration key.
    Example: `protocols.http.port`.
  - value `{any}`: value of the invalid configuration key.
    Example: `-80`.
  - suggestions `{any[]}`: suggestions of possible valid values for the
    configuration key.
    Example: `[80]`.

```json
{
  "type": "CONFIG_VALIDATION",
  "title": "Wrong configuration caught during server startup",
  "description": "Wrong configuration: in 'protocols.http', port must be greater than or equal to 0",
  "status": "SERVER_ERROR"
}
```

### `CONFIG_RUNTIME`

Wrong [configuration](../../server/configuration/README.md) caught runtime.

[_HTTP status code_](../protocols/http.md#error-responses): `500`

[_JSON-RPC error code_](../rpc/jsonrpc.md#error-responses): `-32603`

[_Additional properties_](#error-responses):
  - path 'VARR'
  - value VAL
  - suggestions VAL_ARR

```json
{
  "type": "CONFIG_RUNTIME",
  "title": "Wrong configuration caught runtime",
  "description": "",
  "status": "SERVER_ERROR",
  "instance": "/rest/users/"
}
```

### `FORMAT`

Internal error related to a specific [format](../protocols/formats.md) adapter.

[_HTTP status code_](../protocols/http.md#error-responses): `500`

[_JSON-RPC error code_](../rpc/jsonrpc.md#error-responses): `-32603`

[_Additional properties_](#error-responses):
  - adapter STR

```json
{
  "type": "FORMAT",
  "title": "Internal error related to a specific format adapter",
  "description": "",
  "status": "SERVER_ERROR",
  "instance": "/rest/users/"
}
```

### `CHARSET`

Internal error related to a specific
[charset](../protocols/formats.md#charsets) adapter.

[_HTTP status code_](../protocols/http.md#error-responses): `500`

[_JSON-RPC error code_](../rpc/jsonrpc.md#error-responses): `-32603`

[_Additional properties_](#error-responses):
  - adapter STR

```json
{
  "type": "CHARSET",
  "title": "Internal error related to a specific charset adapter",
  "description": "",
  "status": "SERVER_ERROR",
  "instance": "/rest/users/"
}
```

### `PROTOCOL`

Internal error related to a specific [protocol](../protocols/README.md) adapter.

[_HTTP status code_](../protocols/http.md#error-responses): `500`

[_JSON-RPC error code_](../rpc/jsonrpc.md#error-responses): `-32603`

[_Additional properties_](#error-responses):
  - adapter STR

```json
{
  "type": "PROTOCOL",
  "title": "Internal error related to a specific protocol adapter",
  "description": "",
  "status": "SERVER_ERROR",
  "instance": "/rest/users/"
}
```

### `RPC`

Internal error related to a specific [rpc](../rpc/README.md) adapter.

[_HTTP status code_](../protocols/http.md#error-responses): `500`

[_JSON-RPC error code_](../rpc/jsonrpc.md#error-responses): `-32603`

[_Additional properties_](#error-responses):
  - adapter STR

```json
{
  "type": "RPC",
  "title": "Internal error related to a specific rpc adapter",
  "description": "",
  "status": "SERVER_ERROR",
  "instance": "/rest/users/"
}
```

### `DATABASE`

Internal error related to a specific
[database](../../server/databases/README.md) adapter.

[_HTTP status code_](../protocols/http.md#error-responses): `500`

[_JSON-RPC error code_](../rpc/jsonrpc.md#error-responses): `-32603`

[_Additional properties_](#error-responses):
  - adapter STR

```json
{
  "type": "DATABASE",
  "title": "Internal error related to a specific database adapter",
  "description": "",
  "status": "SERVER_ERROR",
  "instance": "/rest/users/"
}
```

### `LOG`

Internal error related to a specific
[log provider](../../server/quality/logging.md#providers).

[_HTTP status code_](../protocols/http.md#error-responses): `500`

[_JSON-RPC error code_](../rpc/jsonrpc.md#error-responses): `-32603`

[_Additional properties_](#error-responses):
  - adapter STR

```json
{
  "type": "LOG",
  "title": "Internal error related to a specific log adapter",
  "description": "",
  "status": "SERVER_ERROR",
  "instance": "/rest/users/"
}
```

### `COMPRESS`

Internal error related to a specific [compress](../arguments/compression.md)
adapter.

[_HTTP status code_](../protocols/http.md#error-responses): `500`

[_JSON-RPC error code_](../rpc/jsonrpc.md#error-responses): `-32603`

[_Additional properties_](#error-responses):
  - adapter STR

```json
{
  "type": "COMPRESS",
  "title": "Internal error related to a specific compress adapter",
  "description": "",
  "status": "SERVER_ERROR",
  "instance": "/rest/users/"
}
```

### `PLUGIN`

Internal error related to a specific [plugin](../../server/plugins/README.md).

[_HTTP status code_](../protocols/http.md#error-responses): `500`

[_JSON-RPC error code_](../rpc/jsonrpc.md#error-responses): `-32603`

[_Additional properties_](#error-responses):
  - plugin STR

```json
{
  "type": "PLUGIN",
  "title": "Internal error related to a specific plugin",
  "description": "",
  "status": "SERVER_ERROR",
  "instance": "/rest/users/"
}
```

### `ENGINE`

Internal engine error.

[_HTTP status code_](../protocols/http.md#error-responses): `500`

[_JSON-RPC error code_](../rpc/jsonrpc.md#error-responses): `-32603`

```json
{
  "type": "ENGINE",
  "title": "Internal engine error",
  "description": "",
  "status": "SERVER_ERROR",
  "instance": "/rest/users/"
}
```

### `UNKNOWN`

Internal uncaught error.

[_HTTP status code_](../protocols/http.md#error-responses): `500`

[_JSON-RPC error code_](../rpc/jsonrpc.md#error-responses): `-32603`

```json
{
  "type": "UNKNOWN",
  "title": "Internal uncaught error",
  "description": "",
  "status": "SERVER_ERROR",
  "instance": "/rest/users/"
}
```
