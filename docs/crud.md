# RPC system specifics

Since each [RPC system](rpc.md#command-and-arguments) has its own way
of setting the command and arguments, we will use GraphQL in the following
examples.

# Command "find"

To retrieve a specific model, use the command `find` followed by the model name
in plural, e.g.:

```graphql
{
  find_users {
    id
    name
  }
}
```

will respond with the fetched models:

```json
{
  "data": [
    { "id": "1", "name": "Anthony" },
    { "id": "2", "name": "Tom" },
    { "id": "3", "name": "Anna" }
  ]
}
```

To retrieve only one model, use the command `find` followed by the model name
in singular, and specify the model `id`, e.g.:

```graphql
{
  find_user(id: "1") {
    id
    name
    manager
  }
}
```

will respond with:

```json
{
  "data": {
    "id": "1",
    "name": "Anthony",
    "manager": "3"
  }
}
```

# Command "create"

The `create` command creates new models.

The `data` [argument](rpc.md#command-and-arguments) is a single object
when modifying a single model, and an array of objects otherwise.

`id` attributes are optional and default to a unique ID.

```graphql
mutation {
  create_user(data: {name: "David"}) {
    id
    name
  }
}
```

will respond with the newly created model:

```json
{
  "data": {
    "id": "9b6c5433-4f6a-42f3-9082-32c2eae66a7e",
    "name": "David",
  }
}
```

while:

```graphql
mutation {
  create_users(data: [{name: "David"}, {id: "5", name: "Alex"}]) {
    id
    name
  }
}
```

will respond with:

```json
{
  "data": [
    { "id": "9b6c5433-4f6a-42f3-9082-32c2eae66a7e", "name": "David" },
    { "id": "5", "name": "Alex" },
  ]
}
```

# Command "upsert"

The `upsert` command performs a full modification of existing models.
If the models do not exist, they are created instead.

The `data` [argument](rpc.md#command-and-arguments) is a single object
when modifying a single model, and an array of objects otherwise.
Each model must contain an `id` attribute.

```graphql
mutation {
  upsert_user(data: {id: "4", name: "David"}) {
    id
    name
  }
}
```

will respond with the model that was either modified or created:

```json
{
  "data": {
    "id": "4",
    "name": "David",
  }
}
```

while:

```graphql
mutation {
  upsert_users(data: [{id: "4", name: "David"}, {id: "5", name: "Alex"}]) {
    id
    name
  }
}
```

will respond with:

```json
{
  "data": [
    { "id": "4", "name": "David" },
    { "id": "5", "name": "Alex" },
  ]
}
```

# Command "patch"

The `patch` command performs a partial modification of existing models.

The `data` [argument](rpc.md#command-and-arguments) is always a single
object. It specifies the new values to update.
It cannot contain any `id` attribute.

```graphql
mutation {
  patch_user(id: "1", data: {city: "Copenhagen"}) {
    id
    name
  }
}
```

will respond with the newly modified model:

```json
{
  "data": {
    "id": "1",
    "name": "Anthony",
    "city": "Copenhagen",
  }
}
```

while:

```graphql
mutation {
  patch_users(filter: {country: "Denmark"}, data: {city: "Copenhagen"}) {
    id
    name
  }
}
```

will respond with:

```json
{
  "data": [
    { "id": "4", "name": "David", "city": "Copenhagen" },
    { "id": "5", "name": "Alex", "city": "Copenhagen" },
  ]
}
```

# Command "delete"

The `delete` command remove existing models.

```graphql
mutation {
  delete_user(id: "1") {
    id
    name
  }
}
```

will respond with the deleted model:

```json
{
  "data": {
    "id": "1",
    "name": "Anthony",
    "manager": "3"
  }
}
```

```graphql
mutation {
  delete_users(filter: {country: "Denmark"}) {
    id
    name
  }
}
```

will respond with:

```json
{
  "data": [
    { "id": "4", "name": "David", "city": "Copenhagen" },
    { "id": "5", "name": "Alex", "city": "Copenhagen" },
  ]
}
```

# Summary of commands

```graphql
find_model({ id, [silent] })
```

```graphql
find_models({ [filter], [order], [pagesize], [before|after|page],
[silent] })
```

```graphql
create_model({ data, [silent], [dryrun] })
```

```graphql
create_models({ data[], [pagesize], [silent], [dryrun] })
```

```graphql
upsert_model({ data, [silent], [dryrun] })
```

```graphql
upsert_models({ data[], [pagesize], [silent], [dryrun] })
```

```graphql
patch_model({ data, id, [silent], [dryrun] })
```

```graphql
patch_models({ data, [filter], [pagesize], [silent], [dryrun] })
```

```graphql
delete_model({ id, [cascade], [silent], [dryrun] })
```

```graphql
delete_models({ [filter], [cascade], [pagesize], [silent], [dryrun] })
```
