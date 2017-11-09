# Find command

To retrieve a specific model, use the `find` command, e.g.:

```HTTP
GET /rest/users/
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

To retrieve only one model, specify the model `id`, e.g.:

```HTTP
GET /rest/users/1
```

will respond with:

```json
{
  "data": { "id": "1", "name": "Anthony", "manager": "3" }
}
```

# Create command

The `create` command creates new models.

The `data` [argument](rpc.md#rpc) is either a single object
or an array of objects.

```HTTP
POST /rest/users/5

{ "id": "5", "name": "David" }
```

will respond with the newly created model:

```json
{
  "data": { "id": "5", "name": "David" }
}
```

If the `id` attributes are omitted, a unique ID will be set, e.g.:

```HTTP
POST /rest/users/

{ "name": "David" }
```

will respond with:

```json
{
  "data": { "id": "9b6c5433-4f6a-42f3-9082-32c2eae66a7e", "name": "David" }
}
```

Creating several models:

```HTTP
POST /rest/users/

[
  { "name": "David" }
  { "id": "5", "name": "Alex" }
]
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

# Upsert command

The `upsert` command performs a full modification of existing models.
If the models do not exist, they are created instead.

The `data` [argument](rpc.md#rpc) is either a single object
or an array of objects.

Each model must contain an `id` attribute.

```HTTP
PUT /rest/users/4

{ "id": "4", "name": "David" }
```

will respond with the model that was either modified or created:

```json
{
  "data": { "id": "4", "name": "David" }
}
```

while:

```HTTP
PUT /rest/users/

[
  { "id": "4", "name": "David" }
  { "id": "5", "name": "Alex" }
]
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

# Patch command

The `patch` command performs a partial modification of existing models.

The `data` [argument](rpc.md#rpc) is a single object
specifying the new values to update.

It cannot contain any `id` attribute.

```HTTP
PATCH /rest/users/1

{ "city": "Copenhagen" }
```

will respond with the newly modified model:

```json
{
  "data": { "id": "1", "name": "Anthony", "city": "Copenhagen" }
}
```

while:

```HTTP
PATCH /rest/users/

{ "city": "Copenhagen" }
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

# Delete command

The `delete` command remove existing models.

```HTTP
DELETE /rest/users/1
```

will respond with the deleted model:

```json
{
  "data": { "id": "1", "name": "Anthony", "manager": "3" }
}
```

while:

```HTTP
DELETE /rest/users/
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

# Different RPC systems

The examples above are specific to [REST](rest.md).

REST specifies the `data` argument with the request payload, the
`id` argument with the URL and the command with the protocol method. However,
other [RPC systems](rpc.md) have different conventions.

# Summary of commands

```graphql
find_collection({ [id|filter], [order], [pagesize], [before|after|page],
[silent] })
```

```graphql
create_collection({ data|data[], [pagesize], [silent], [dryrun] })
```

```graphql
upsert_collection({ data|data[], [pagesize], [silent], [dryrun] })
```

```graphql
patch_collection({ data, [id|filter], [pagesize], [silent], [dryrun] })
```

```graphql
delete_collection({ [id|filter], [cascade], [pagesize], [silent], [dryrun] })
```
