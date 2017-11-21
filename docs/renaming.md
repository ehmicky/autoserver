# Renaming attributes in response

The `rename` [argument](rpc.md#rpc) can be used to rename attributes in the
response.

It is a comma-separated list of `name:different_name`.
[Nested attributes](relations.md#populating-nested-collections) can be
specified using a dot notation, e.g.:

```HTTP
GET /rest/users/1?select=name:different_name
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

Note that [GraphQL](graphql.md#selection-and-population) does not need the
`rename` argument since it natively uses selection fields.
