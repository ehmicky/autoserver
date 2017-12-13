# Endpoint

[GraphQL](http://graphql.org/) is one of the available [RPC systems](../syntax/rpc.md).

Clients can query the GraphQL server at `//hostname:port/graphql`.

# Debugging

Clients can perform interactive queries using a web application available at
`//hostname:port/graphiql`.
They can see the GraphQL schema by clicking on `Documentation explorer`.

Clients can also see the GraphQL schema as HTML at
`//hostname:port/graphql/schema`.

# Command and arguments

The [command](../syntax/rpc.md#rpc) is specified using the
top-level GraphQL method name, e.g. `find_users` or `create_users`.

The [arguments](../syntax/rpc.md#rpc) are specified using the top-level GraphQL arguments.

The response's metadata are available under the `extensions` property.

For example:

```graphql
{
  find_users(id: "1") {
    id
    name
    manager
  }
}
```

would respond with:

```json
{
  "data": {
    "id": "1",
    "name": "Anthony",
    "manager": "3"
  },
  "extensions": {
    "requestid": "56ca9a87-73cc-48db-95fa-ec62e2dee812"
  }
}
```

# Selection, population and renaming

GraphQL selection fields must be used instead of both the
[`select`](../arguments/selecting.md),
[`populate`](../query/relations.md#populating-nested-collections) and
[`rename`](../arguments/renaming.md) arguments.

The special attribute `all` can be used to select all attributes.

# Error responses

GraphQL error responses follow the usual error
[response format](../query/error.md#error-responses), with some changes
to accomodate the
[GraphQL spec](https://facebook.github.io/graphql/#sec-Errors):
  - `error` is called `errors`, and is an array containing a single object.
  - `description` is named `message`

For example:

```json
{
  "data": null,
  "errors": [
    {
      "message": "The 'users' model with 'id' '20' could not be found",
      "title": "Model not found",
      "type": "DB_MODEL_NOT_FOUND",
      "status": 404,
      "instance": "/graphql"
    }
  ],
  "extensions": {
    "requestid": "56ca9a87-73cc-48db-95fa-ec62e2dee812",
    "duration": 15,
    "info": { ... }
  }
}
```
