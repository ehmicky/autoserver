# Selection

The `select` [argument](client/syntax/rpc.md#rpc) can be used to filter which attributes are
present in the response.

It is a comma-separated list of attribute names.
[Nested attributes](client/query/relations.md#populating-nested-collections) can be
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

[GraphQL](client/syntax/graphql.md#selection-and-population) does not need the
`select` [argument](client/syntax/rpc.md#rpc) since it natively uses selection fields.
