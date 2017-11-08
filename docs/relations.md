# Definition

Models can refer to each other by using the other model's name as
`attribute.type` in their [schema definition](schema.md), either as a scalar
value or an array, for one-to-one or one-to-many relationship.

For example:

```yml
models:
  user:
    attributes:
      friend:
        type: user
      managers:
        type: user[]
```

Models can nest themselves, i.e. be recursive.

Nested attributes are using the `id` attribute of the model they refer to.

# Populating nested models

Clients can populate nested models in output with the `populate` argument.
It is a comma-separated list of attribute names. Nested attributes can be
specified using a dot notation.

For example, with JSON-RPC:

```json
{
  "jsonrpc": "2.0",
  "id": "9b6c5433-4f6a-42f3-9082-32c2eae66a7e",
  "method": "find_user",
  "params": {
    "id": "1",
    "populate": "manager,manager.colleague"
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
      "id": "1",
      "name": "Anthony",
      "manager": {
        "id": "3",
        "name": "Anna",
        "colleague": {
          "id": "4",
          "name": "David"
        }
      }
    }
  }
}
```

Note that [GraphQL](graphql.md#selection-and-population) does not need the
`populate` argument since it natively uses selection fields.

Write commands do not use the `populate` argument. Instead, any models present
in either the `data` or `cascade` [argument](rpc.md#command-and-arguments)
will be populated in output.

# Modifying nested models

Clients can modify nested models by using a nested [`data` argument](crud.md), e.g.:

```graphql
mutation {
  create_user(data: {
    id: "1"
    name: "Anthony"
    manager: {
      id: "3"
      name: "Anna"
    }
  }) {
    id
  }
}
```

will create both the user and its manager.

# Deleting nested models

To delete nested models, specify them using the `cascade`
[argument](rpc.md#command-and-arguments), as a comma-separated list of
nested models, e.g.:

```graphql
mutation {
  delete_user(id: "1", cascade: "manager,manager.friend,colleague") {
    id
  }
}
```

will delete `user`, `user.manager`, `user.manager.friend` and `user.colleague`.
