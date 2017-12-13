# Different RPC systems

The examples below are specific to [REST](../syntax/rest.md).

REST specifies the `data` [argument](../syntax/rpc.md#rpc) with the request payload, the
`id` [argument](../syntax/rpc.md#rpc) with the URL and the command with the protocol
method. However, other [RPC systems](../syntax/rpc.md) have different conventions.

# Find command

To retrieve a specific model, use the `find` command.

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

To retrieve only one model, specify the model `id`.

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

The `data` [argument](../syntax/rpc.md#rpc) is either a single object
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

If the `id` attributes are omitted, a unique ID will be set.

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

The `data` [argument](../syntax/rpc.md#rpc) is either a single object
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

The `data` [argument](../syntax/rpc.md#rpc) is a single object
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

Advanced patch commands are also available, for example:

```HTTP
PATCH /rest/users/1

{ "age": { "_add": 1 } }
```

More information can be found [here](patch.md).

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

# Summary of commands

```graphql
find_collection({ [id|filter], [order], [populate], [pagesize],
[before|after|page], [select], [rename], [silent], [params] })
```

```graphql
create_collection({ data|data[], [select], [rename], [silent], [dryrun],
[params] })
```

```graphql
upsert_collection({ data|data[], [select], [rename], [silent], [dryrun],
[params] })
```

```graphql
patch_collection({ data, [id|filter], [pagesize], [after], [select], [rename],
[silent], [dryrun], [params] })
```

```graphql
delete_collection({ [id|filter], [cascade], [select], [rename], [silent],
[dryrun], [params] })
```

More information on each [argument](../syntax/rpc.md#rpc) can be found here:
[`id`](../arguments/filtering.md#id-argument),
[`filter`](../arguments/filtering.md),
[`order`](../arguments/sorting.md),
[`populate`](relations.md#populating-nested-collections),
[`cascade`](relations.md#deleting-nested-collections),
[`pagesize`](../arguments/pagination.md#page-size),
[`before`](../arguments/pagination.md#backward-iteration),
[`after`](../arguments/pagination.md#cursor-pagination),
[`page`](../arguments/pagination.md#offset-pagination),
[`select`](../arguments/selecting.md),
[`rename`](../arguments/renaming.md),
[`silent`](../arguments/silent.md),
[`dryrun`](../arguments/dryrun.md),
[`params`](../arguments/params.md),
[`data`](#create-command)
