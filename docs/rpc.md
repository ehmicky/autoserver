# RPC

Multiple RPC systems can be handled on the same server.

Note that most examples in this documentation only show GraphQL for simplicity.

# Command and arguments

Each RPC system has its own way of setting the main command and the arguments.

For example, GraphQL specifies this in the request payload, while REST uses
also use the URL and the protocol method.

In addition to being specified using the RPC system, arguments can also be
specified in any [protocol](protocols.md)
[header](protocols.md#headers-and-method) (e.g. HTTP headers) prefixed
with `X-Apiengine-`.

For example, instead of specifying the `{ filter: { name: "David" } }`
argument in the GraphQL payload, the following
[header](protocols.md#headers-and-method) can be used:
`X-Apiengine-Filter-Name: David`.

The header value can either be an unquoted string or any JSON value.

# Available RPC systems

  - [GraphQL](graphql.md)
