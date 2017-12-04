# Endpoint

[JSON-RPC](http://www.jsonrpc.org) is one of the available
[RPC systems](rpc.md).

Both JSON-RPC 1.0 and 2.0 are supported.

Clients can query the GraphQL server at `//hostname:port/jsonrpc`.
The `POST` protocol method must be used.

# Command and arguments

The [command](rpc.md#rpc) is specified using the
JSON-RPC `method` field (which is different from the protocol method, e.g.
`POST`).

The [arguments](rpc.md#rpc) are specified using the
JSON-RPC `params` field.

For example, the following request:

```json
{
  "jsonrpc": "2.0",
  "id": "9b6c5433-4f6a-42f3-9082-32c2eae66a7e",
  "method": "find_users",
  "params": {
    "id": "1"
  }
}
```

would respond with:

```json
{
  "jsonrpc": "2.0",
  "id": "9b6c5433-4f6a-42f3-9082-32c2eae66a7e",
  "result": {
    "data": {
      "id": "1",
      "name": "Anthony",
      "manager": "3"
    }
  }
}
```

# Error responses

JSON-RPC error responses follow the usual error
[response format](error.md#error-responses-sent-to-clients), with some changes
to accomodate the JSON-RPC spec:
  - the main response's envelope conforms to JSON-RPC, e.g. it has a
    JSON-RPC error code
  - the main error information is available under `error.data`
  - `error.data.description` is available under `error.message`

```json
{
  "jsonrpc": "2.0",
  "id": "9b6c5433-4f6a-42f3-9082-32c2eae66a7e",
  "error": {
    "code": 1,
    "message": "The 'users' model with 'id' '20' could not be found",
    "data": {
      "type": "DB_MODEL_NOT_FOUND",
      "title": "Model not found",
      "status": "CLIENT_ERROR",
      "instance": "/jsonrpc",
      "origin": "http://localhost:5001",
      "protocol": "http",
      "method": "POST",
      "queryvars": {},
      "headers": {},
      "payloadsize": 483,
      "format": "json",
      "charset": "utf-8",
      "compress": "gzip,identity",
      "rpc": "jsonrpc",
      "summary": "users",
      "args": {
        "id": "20"
      },
      "commandpath": "users",
      "collection": "users",
      "command": "find"
    },
    "metadata": {
  		"requestid": "56ca9a87-73cc-48db-95fa-ec62e2dee812"
  	}
  }
}
```
