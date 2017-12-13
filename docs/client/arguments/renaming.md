# Renaming attributes in response

The `rename` [argument](../rpc/README.md#rpc) can be used to rename attributes
in the response.

It is a comma-separated list of `name:different_name`.
[Nested attributes](../request/relations.md#populating-nested-collections) can be
specified using a dot notation.

```HTTP
GET /rest/users/1?rename=name:different_name
```

will respond with:

```json
{
  "data": {
    "different_name": "Anthony"
  }
}
```

instead of:

```json
{
  "data": {
    "name": "Anthony"
  }
}
```

[GraphQL](../rpc/graphql.md#selection-population-and-renaming) does not need
the `rename` [argument](../rpc/README.md#rpc) since it natively uses selection
fields.
