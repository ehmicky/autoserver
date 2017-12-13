# RPC systems

The examples below are specific to [REST](../rpc/rest.md).

REST specifies the `data` [argument](../rpc/README.md#rpc) with the request
payload, the `id` [argument](../rpc/README.md#rpc) with the URL and the command
with the protocol method. However other [RPC systems](../rpc/README.md) have
different conventions.

# Find command

To retrieve a specific model, use the `find` command.

```HTTP
GET /rest/users/
```

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

```json
{
  "data": { "id": "1", "name": "Anthony", "manager": "3" }
}
```

# Create command

The `create` command creates new models.

The `data` [argument](../rpc/README.md#rpc) is either a single model:

```HTTP
POST /rest/users/5

{ "id": "5", "name": "David" }
```

```json
{
  "data": { "id": "5", "name": "David" }
}
```

or several models:

```HTTP
POST /rest/users/

[
  { "name": "David" }
  { "id": "5", "name": "Alex" }
]
```

```json
{
  "data": [
    { "id": "9b6c5433-4f6a-42f3-9082-32c2eae66a7e", "name": "David" },
    { "id": "5", "name": "Alex" },
  ]
}
```

If the `id` attributes are omitted, a unique ID will be set.

```HTTP
POST /rest/users/

{ "name": "David" }
```

```json
{
  "data": { "id": "9b6c5433-4f6a-42f3-9082-32c2eae66a7e", "name": "David" }
}
```

# Upsert command

The `upsert` command performs a full modification of existing models.
If the models do not exist, they are created instead.

The `data` [argument](../rpc/README.md#rpc) is either a single object
or an array of objects.

Each model must contain an `id` attribute.

```HTTP
PUT /rest/users/4

{ "id": "4", "name": "David" }
```

```json
{
  "data": { "id": "4", "name": "David" }
}
```

With several models:

```HTTP
PUT /rest/users/

[
  { "id": "4", "name": "David" }
  { "id": "5", "name": "Alex" }
]
```

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

The `data` [argument](../rpc/README.md#rpc) is a single object specifying the
new values to update.

It cannot contain any `id` attribute.

```HTTP
PATCH /rest/users/1

{ "city": "Copenhagen" }
```

```json
{
  "data": { "id": "1", "name": "Anthony", "city": "Copenhagen" }
}
```

With several models:

```HTTP
PATCH /rest/users/

{ "city": "Copenhagen" }
```

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

The `delete` command removes existing models.

```HTTP
DELETE /rest/users/1
```

```json
{
  "data": { "id": "1", "name": "Anthony", "manager": "3" }
}
```

With several models:

```HTTP
DELETE /rest/users/
```

```json
{
  "data": [
    { "id": "4", "name": "David", "city": "Copenhagen" },
    { "id": "5", "name": "Alex", "city": "Copenhagen" },
  ]
}
```
