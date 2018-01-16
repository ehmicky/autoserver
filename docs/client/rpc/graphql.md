# Endpoint

[GraphQL](http://graphql.org/) is one of the available [RPC systems](README.md).

Clients can query the GraphQL server at `//HOST/graphql`.

# Debugging

Clients can perform interactive requests using a web application available at
`//HOST/graphiql`.
They can see the GraphQL schema by clicking on `Documentation explorer`.

Clients can also see the GraphQL schema as HTML at `//HOST/graphql/schema`.

# Command and arguments

The collection and the [command](README.md#rpc) are specified using the
top-level GraphQL method name.

For example `{ find_users { ... } }` specifies the `users` collection and the
`find` command.

The [arguments](README.md#rpc) are specified using the top-level GraphQL
arguments.

The response's `metadata` are available under the `extensions` property.

# Selection, population and renaming

GraphQL selection fields must be used instead of the
[`select`](../arguments/selecting.md),
[`populate`](../request/relations.md#populating-nested-collections) and
[`rename`](../arguments/renaming.md) arguments.

The special attribute `all` can be used to select all attributes.

# Example

Fetching `users` with `id` `1`:

```graphql
{
  find_users(id: "1") {
    id
    name
    manager
  }
}
```

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

# Error responses

GraphQL error responses follow the usual error
[response format](../request/error.md#error-responses), with some changes
to accomodate the
[GraphQL spec](https://facebook.github.io/graphql/#sec-Errors):
  - `error` is called `errors`, and is an array containing a single object.
  - `description` is named `message`

```json
{
  "data": null,
  "errors": [
    {
      "type": "NOT_FOUND",
      "title": "Some database models could not be found, e.g. the ids were invalid",
      "message": "The 'users' model with 'id' '20' could not be found",
      "status": "CLIENT_ERROR",
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
