# Selection

The `select` [argument](rpc.md#command-and-arguments) can be used to
filter which attributes are present in the response.

It is a comma-separated list of attribute names, e.g. `select: "id,name"`.

The special attribute `all` can be used to select all attributes
(which is the default behavior, except with [GraphQL](graphql.md#selection)).

# Renaming attributes in response

It is possible to rename attributes in the response with the `select`
[argument](rpc.md#command-and-arguments), e.g. `select: "name=different_name"`
will rename `name` attributes to `different_name` in the response.

# Populating

The `select` [argument](rpc.md#command-and-arguments) can target nested
models by using a dot notation, e.g. `select: "child.all,other_child.id"`.

When nested models are selected, they are automatically populated by the server.
I.e. the `select` [argument](rpc.md#command-and-arguments) is used for
populating nested models in the response.
