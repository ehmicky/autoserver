# Selection

The `select` [argument](../syntax/rpc.md#rpc) can be used to filter which
attributes are present in the response.

It is a comma-separated list of attribute names.
[Nested attributes](../query/relations.md#populating-nested-collections) can be
specified using a dot notation.

```HTTP
GET /rest/users/1?select=name
```

will respond with:

```json
{
  "data": {
    "name": "Anthony"
  }
}
```

[GraphQL](../syntax/graphql.md#selection-population-and-renaming) does not need
the `select` [argument](../syntax/rpc.md#rpc) since it natively uses selection
fields.
