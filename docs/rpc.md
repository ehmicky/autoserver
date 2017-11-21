# RPC

Multiple RPC systems can be handled on the same server.

An RPC is a system defining the way clients specify:
  - the command, e.g. `find` or `delete`
  - the collection, e.g. `users`
  - the arguments, e.g. the `data` argument or the model's `id`

RPC systems use the URL, the protocol headers, the request payload, the
protocol method or a combination of them.

Most examples in this documentation only show [REST](rest.md) for simplicity.

# Available RPC systems

  - [REST](rest.md)
  - [GraphQL](graphql.md)
  - [JSON-RPC](jsonrpc.md)

# Examples

The following examples produce the same request. Notice the differences for the
`filter`, `data`, `dryrun`, `select`, `rename` and `populate` arguments.

[REST](rest.md):

```HTTP
PATCH /rest/users/?filter.0.name=David&filter.0.name=Bob&select=id,manager,manager.name&rename=manager.name:aliasname&populate=manager&dryrun

{ "city": "Copenhagen" }
```

[GraphQL](graphql.md):

```graphql
{
  patch_users(
    filter: [{ name: "David" }, { name: "Bob" }]
    data: { city: "Copenhagen" }
    dryrun: true
  ) {
    id
    manager: { name: aliasname }
  }
}
```

[JSON-RPC](jsonrpc.md):

```json
{
  "jsonrpc": "2.0",
  "id": "9b6c5433-4f6a-42f3-9082-32c2eae66a7e",
  "method": "patch_users",
  "params": {
    "filter": [{ "name": "David" }, { "name": "Bob" }],
    "data": { "city": "Copenhagen" },
    "select": "id,manager,manager.name",
    "rename": "manager.name:aliasname",
    "populate": "manager",
    "dryrun": true,
  }
}
```
