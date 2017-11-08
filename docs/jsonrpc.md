# Endpoint

JSON-RPC is one of the available [RPC systems](rpc.md).

Both JSON-RPC 1.0 and 2.0 are supported.

Clients can query the GraphQL server at `//hostname:port/jsonrpc`.
The `POST` HTTP method must be used.

# Command and arguments

The [command](rpc.md#command-and-arguments) is specified using the
JSON-RPC `method` field.

The [arguments](rpc.md#command-and-arguments) are specified using the
JSON-RPC `params` field.

For example, the following request:

```json
{
  "jsonrpc": "2.0",
  "id": "9b6c5433-4f6a-42f3-9082-32c2eae66a7e",
  "method": "find_user",
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
    "message": "The 'user' model with 'id' '20' could not be found",
    "data": {
      "type": "DB_MODEL_NOT_FOUND",
      "title": "Model not found",
      "instance": "http://localhost:5001/jsonrpc",
      "status": "CLIENT_ERROR",
      "protocolstatus": 404,
      "protocol": "http",
      "method": "create",
      "requestheaders": {
        "host": "localhost:5001",
        "accept": "*/*",
        "accept-encoding": "deflate, gzip",
        "content-type": "application/json",
        "content-length": "121"
      },
      "queryvars": {},
      "rpc": "jsonrpc",
      "summary": "find_user",
      "args": {
        "id": "20"
      },
      "commandpath": "find_user",
      "model": "user",
      "command": "find",
      "requestid": "812ae714-ecf7-4e41-88a1-5337b034745e"
    }
  }
}
```
