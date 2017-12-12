# Selection

The `select` [argument](rpc.md#rpc) can be used to filter which attributes are
present in the response.

It is a comma-separated list of attribute names.
[Nested attributes](relations.md#populating-nested-collections) can be
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

[GraphQL](graphql.md#selection-and-population) does not need the
`select` [argument](rpc.md#rpc) since it natively uses selection fields.
