# Endpoint

[REST](https://en.wikipedia.org/wiki/Representational_state_transfer)
is one of the available [RPC systems](README.md).

Clients can make REST requests at either `//HOST/rest/COLLECTION/` or
`//HOST/rest/COLLECTION/ID`.

The `COLLECTION`'s name is in the URL.

If an `ID` is present in the URL, it will be used as the
[`id`](../arguments/filtering.md#id-argument) [argument](README.md#rpc).

# Command

The [command](../request/crud.md) is specified using the HTTP method:
  - `GET` and `HEAD` uses the [`find`](../request/crud.md#find-command) command
  - `POST` uses the [`create`](../request/crud.md#create-command) command
  - `PUT` uses the [`upsert`](../request/crud.md#upsert-command) command
  - `PATCH` uses the [`patch`](../request/crud.md#patch-command) command
  - `DELETE` uses the [`delete`](../request/crud.md#delete-command) command

# Arguments

The `data` [argument](README.md#rpc) is specified using the full request
payload.

The other [arguments](README.md#rpc) are specified using URL query variables.

Omitted values default to `true`, e.g. `?dryrun` is the same as `?dryrun=true`.

Values can be either an unquoted string or any JSON value. To differentiate
between a number (e.g. `filter.weight=5`) and a string (e.g. `filter.id="5"`),
surround the number with double quotes.

Objects and arrays can be specified using either:
  - a dot notation, e.g. `filter.0.name=David`
  - a JSON value, e.g. `filter=[{ "name": "David" }]`, which after URL encoding
    is `filter=%5B%7B%22name%22%3A%22David%22%7D%5D`

Like for any URL, the query variables must be
[URL encoded](https://en.wikipedia.org/wiki/Percent-encoding) if they contain
any character that needs to be encoded.

# Examples

Fetching `users` with `id` `1`:

```HTTP
GET /rest/users/1
```

```json
{
  "data": { "id": "1", "name": "Anthony", "manager": "3" }
}
```

Fetching `users` with `name` `Anthony`:

```HTTP
GET /rest/users/?filter.name=Anthony
```

```json
{
  "data": [
    { "id": "1", "name": "Anthony", "manager": "3" }
  ]
}
```

Modifying `users` with `id` `1`:

```HTTP
PUT /rest/users/1

{ "id": "1", "name": "Anthony", "manager": "3" }
```

```json
{
  "data": { "id": "1", "name": "Anthony", "manager": "3" }
}
```

# Error responses

REST error responses follow the usual error
[response format](../request/error.md#error-responses):

```json
{
  "error": {
    "type": "NOT_FOUND",
    "title": "Some database models could not be found, e.g. the ids were invalid",
    "description": "The 'users' model with 'id' '20' could not be found",
    "status": "CLIENT_ERROR",
    "instance": "/rest/users/20"
  },
  "metadata": {
    "requestid": "56ca9a87-73cc-48db-95fa-ec62e2dee812",
    "duration": 15,
    "info": { ... }
  }
}
```
