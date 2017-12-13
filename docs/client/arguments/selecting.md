# Selection

The `select` [argument](../rpc/README.md#rpc) can be used to filter which
attributes are present in the response.

It is a comma-separated list of attribute names.
[Nested attributes](../request/relations.md#populating-nested-collections) can
be specified using a dot notation.

```HTTP
GET /rest/users/1?select=name
```

```json
{
  "data": {
    "name": "Anthony"
  }
}
```

[GraphQL](../rpc/graphql.md#selection-population-and-renaming) does not need
the `select` [argument](../rpc/README.md#rpc) since it natively uses selection
fields.
