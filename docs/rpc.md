# RPC

Multiple RPC systems can be handled on the same server.

An RPC is a system defining the way clients specify:
  - the command, e.g. `find` or `delete`
  - the collection, e.g. `users`
  - the arguments, e.g. the `data` argument or the model's `id`

RPC systems use the URL, the protocol headers, the request payload, the
protocol method or a combination of them.

Most examples in this documentation only show [REST](rest.md) for simplicity.

# RPC-agnostic arguments

In addition to being specified using the RPC system, arguments can also be
specified in any [protocol](protocols.md)
[header](protocols.md#headers-and-method) (e.g. HTTP headers) prefixed
with `X-Apiengine-`.

For example, instead of specifying the `{ filter: { name: "David" } }`
argument in the [GraphQL](graphql.md) payload, the following
[protocol header](protocols.md#headers-and-method) can be used:
`X-Apiengine-Filter-Name: David`.

The header value can either be an unquoted string or any JSON value.

# Available RPC systems

  - [REST](rest.md)
  - [GraphQL](graphql.md)
  - [JSON-RPC](jsonrpc.md)

# Examples

The following examples produce the same request. Notice the differences for the
`filter`, `data`, `dryrun`, `select` and `populate` arguments.

[REST](rest.md):

```HTTP
PATCH /rest/users/?filter.0.name=David&filter.0.name=Bob&select=id,manager,manager.name&populate=manager&dryrun

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
    manager: { name }
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
    "populate": "manager",
    "dryrun": true,
  }
}
```
