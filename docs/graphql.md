# Endpoint

[GraphQL](http://graphql.org/) is one of the available [RPC systems](rpc.md).

Clients can query the GraphQL server at `//hostname:port/graphql`.

# Debugging

Clients can perform interactive queries using a web application available at
`//hostname:port/graphiql`.
They can see the GraphQL schema by clicking on `Documentation explorer`.

Clients can also see the GraphQL schema as HTML at
`//hostname:port/graphql/schema`.

# Command and arguments

The [command](rpc.md#command-and-arguments) is specified using the
top-level GraphQL method name, e.g. `find_user` or `create_users`.

The [arguments](rpc.md#command-and-arguments) are specified using the
top-level GraphQL arguments.

For example:

```graphql
{
  find_user(id: "1") {
    id
    name
    manager
  }
}
```

uses the command `find_user` and the
[argument](rpc.md#command-and-arguments) `id`.

# Selection and population

GraphQL selection fields must be used instead of both the
[`select`](selecting.md) and
[`populate`](relations.md#populating-nested-models) arguments.

The special attribute `all` can be used to select all attributes.

# Error responses

GraphQL error responses follow the usual error
[response format](error.md#error-responses-sent-to-clients), with some changes
to accomodate the
[GraphQL spec](https://facebook.github.io/graphql/#sec-Errors):
  - `error` is called `errors`, and is an array containing a single object.
  - `protocolstatus` is named `status`
  - `description` is named `message`
  - `details` is named `stack`

For example:

```json
{
  "data": null,
  "errors": [
    {
      "message": "The 'user' model with 'id' '20' could not be found",
      "title": "Model not found",
      "type": "DB_MODEL_NOT_FOUND",
      "status": 404,
      "instance": "http://localhost:5001/graphql",
      "protocol": "http",
      "method": "GET",
      "requestheaders": {
        "host": "localhost:5001",
        "accept": "*/*",
        "accept-encoding": "deflate, gzip",
        "content-type": "application/json",
        "content-length": "481"
      },
      "queryvars": {},
      "rpc": "graphql",
      "summary": "find_user",
      "args": {
        "id": "20",
        "select": "id"
      },
      "commandpath": "find_user",
      "model": "user",
      "command": "find",
      "requestid": "ed9d9f92-9ee5-4363-8d96-9b5e85c457d9"
    }
  ]
}
```
