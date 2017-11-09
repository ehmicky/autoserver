# Definition

Models can refer to each other by using the other model's name as
`attribute.type` in their [schema definition](schema.md), either as a scalar
value or an array, for one-to-one or one-to-many relationship.

For example:

```yml
models:
  users:
    attributes:
      friends:
        type: users[]
      manager:
        type: users
```

Models can nest themselves, i.e. be recursive.

Nested attributes are using the `id` attribute of the model they refer to.

# Populating nested models

Clients can populate nested models in output with the `populate` argument.
It is a comma-separated list of attribute names. Nested attributes can be
specified using a dot notation, e.g.:

```HTTP
GET /rest/users/1?populate=manager,manager.colleague
```

will respond with:

```json
{
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
```

Note that [GraphQL](graphql.md#selection-and-population) does not need the
`populate` argument since it natively uses selection fields.

Write commands do not use the `populate` argument. Instead, any models present
in either the `data` or `cascade` [argument](rpc.md#rpc)
will be populated in output.

# Modifying nested models

Clients can modify nested models by using a nested [`data` argument](crud.md), e.g.:

```HTTP
PUT /rest/users/1

{
  "id": "1",
  "name": "Anthony",
  "manager": {
    "id": "3",
    "name": "Anna"
  }
}
```

will create both the user and its manager.

# Deleting nested models

To delete nested models, specify them using the `cascade`
[argument](rpc.md#rpc), as a comma-separated list of
nested models, e.g.:

```HTTP
DELETE /rest/users/1?cascade=manager,manager.friends,colleague
```

will delete `user`, `user.manager`, `user.manager.friends` and `user.colleague`.
