# Selection

The `select` [argument](rpc.md#command-and-arguments) can be used to
filter which attributes are present in the response.

It is a comma-separated list of attribute names.
[Nested attributes](relations.md#populating-nested-models) can be
specified using a dot notation.

For example, with JSON-RPC:

```json
{
  "jsonrpc": "2.0",
  "id": "9b6c5433-4f6a-42f3-9082-32c2eae66a7e",
  "method": "find_user",
  "params": {
    "id": "1",
    "select": "name"
  }
}
```

will respond with:

```json
{
  "jsonrpc": "2.0",
  "id": "9b6c5433-4f6a-42f3-9082-32c2eae66a7e",
  "result": {
    "data": {
      "name": "Anthony"
    }
  }
}
```

Note that [GraphQL](graphql.md#selection-and-population) does not need the
`select` argument since it natively uses selection fields.

# Renaming attributes in response

It is possible to rename attributes in the response with the `select`
[argument](rpc.md#command-and-arguments) by using `name=different_name`.

For example, with JSON-RPC:

```json
{
  "jsonrpc": "2.0",
  "id": "9b6c5433-4f6a-42f3-9082-32c2eae66a7e",
  "method": "find_user",
  "params": {
    "id": "1",
    "select": "name=different_name"
  }
}
```

will respond with:

```json
{
  "jsonrpc": "2.0",
  "id": "9b6c5433-4f6a-42f3-9082-32c2eae66a7e",
  "result": {
    "data": {
      "different_name": "Anthony"
    }
  }
}
```
