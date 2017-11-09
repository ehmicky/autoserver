# Selection

The `select` [argument](rpc.md#rpc) can be used to
filter which attributes are present in the response.

It is a comma-separated list of attribute names.
[Nested attributes](relations.md#populating-nested-models) can be
specified using a dot notation, e.g.:

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

Note that [GraphQL](graphql.md#selection-and-population) does not need the
`select` argument since it natively uses selection fields.

# Renaming attributes in response

It is possible to rename attributes in the response with the `select`
[argument](rpc.md#rpc) by using `name:different_name`, e.g.:

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
