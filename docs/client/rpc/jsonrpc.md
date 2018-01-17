# Endpoint

[JSON-RPC](http://www.jsonrpc.org) is one of the available
[RPC systems](README.md).

Both JSON-RPC 1.0 and 2.0 are supported.

Clients can query the GraphQL server at `//HOST/jsonrpc`.
The `POST` [protocol method](../protocols/README.md) must be used.

# Command and arguments

The collection and the [command](README.md#rpc) are specified using the
JSON-RPC `method` field.

For example `{ "method": "find_users" }` specifies the `users` collection and
the `find` command.

The [arguments](README.md#rpc) are specified using the JSON-RPC `params` field.

# Example

Fetching `users` with `id` `1`:

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
[response format](../request/error.md#error-responses), with some changes
to accomodate the JSON-RPC spec:
  - the main response's envelope conforms to JSON-RPC, e.g. it has an
    [error code](../request/error.md#error-types). See the previous link for a
    list of the error codes used.
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
      "type": "NOT_FOUND",
      "title": "Some database models could not be found, e.g. the ids were invalid",
      "status": "CLIENT_ERROR",
      "instance": "/jsonrpc"
    },
    "metadata": {
      "requestid": "56ca9a87-73cc-48db-95fa-ec62e2dee812",
      "duration": 15,
      "info": { ... }
    }
  }
}
```
