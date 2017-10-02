# Definition

Models can refer to each other by using the other model's name as
`attribute.type` in their [IDL definition](idl.md), either as a scalar value
or an array, for one-to-one or one-to-many relationship.

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

# Modifying nested models

Clients can modify nested models by using a nested `data` argument, e.g.:

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

To delete nested models, specify them using the `cascade` argument,
as a comma-separated list of nested models, e.g.:

```graphql
mutation {
  delete_user(filter: {id: "1"}, cascade: "manager.friend,colleague") {
    id
  }
}
```

will delete `user`, `user.manager.friend` and `user.colleague`.

# Populating nested models

Clients can populate nested models in output, e.g.:

```graphql
{
  find_user(filter: {id: "1"}) {
    id
    name
    manager {
      id
      name
    }
  }
}
```

will respond with:

```json
{
  "data": {
    "id": "1",
    "name": "Anthony",
    "manager": {
      "id": "3",
      "name": "Anna"
    }
  }
}
```

This is available for any command, including `delete`, `create`, etc.

Populating nested models in output is distinct from
[modifying](#modifying-nested-models) or [deleting](#deleting-nested-models)
nested models in input.
