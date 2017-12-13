# Endpoint

[REST](https://en.wikipedia.org/wiki/Representational_state_transfer)
is one of the available [RPC systems](client/syntax/rpc.md).

Clients can query the GraphQL server at either
`//hostname:port/rest/COLLECTION/` or `//hostname:port/rest/COLLECTION/ID`,
where `COLLECTION` represents the collection's name and `ID` its `id` attribute.

# Command

The [command](client/syntax/rpc.md#rpc) is guessed from the collection's name
in the URL, and from the HTTP method:
  - `GET` and `HEAD` uses the [`find`](client/query/crud.md#find-command) command
  - `POST` uses the [`create`](client/query/crud.md#create-command) command
  - `PUT` uses the [`upsert`](client/query/crud.md#upsert-command) command
  - `PATCH` uses the [`patch`](client/query/crud.md#patch-command) command
  - `DELETE` uses the [`delete`](client/query/crud.md#delete-command) command

If an `ID` is present in the URL, the response will be an object instead of
an array of objects. Also the `ID` will be used as the
[`id`](client/arguments/filtering.md#id-argument) [argument](client/syntax/rpc.md#rpc).

# Arguments

The [arguments](client/syntax/rpc.md#rpc) are specified using URL query
variables, except for the `data` [argument](client/syntax/rpc.md#rpc), which is specified
using the full request payload.

Values can be either an unquoted string or any JSON value. To differentiate
between a number (e.g. `filter.weight=5`) and a string (e.g. `filter.id="5"`),
surround the number with double quotes.

Objects and arrays can be specified using either:
  - a dot notation, e.g. `filter.0.name=David`
  - a JSON value, e.g. `filter=[{ "name": "David" }]`, which after URL encoding
    is `filter=%5B%7B%22name%22%3A%22David%22%7D%5D`

Omitted values default to `true`, e.g. `?dryrun` is the same as `?dryrun=true`.

Like for any URL, the query variables must be
[URL encoded](https://en.wikipedia.org/wiki/Percent-encoding) if they contain
any character that needs to be encoded.

# Examples

The following request:

```HTTP
GET /rest/users/1
```

would respond with:

```json
{
  "data": { "id": "1", "name": "Anthony", "manager": "3" }
}
```

The following request:

```HTTP
GET /rest/users/?filter.name=Anthony
```

would respond with:

```json
{
  "data": [
    { "id": "1", "name": "Anthony", "manager": "3" }
  ]
}
```

The following request:

```HTTP
PUT /rest/users/1

{ "id": "1", "name": "Anthony", "manager": "3" }
```

would respond with:

```json
{
  "data": { "id": "1", "name": "Anthony", "manager": "3" }
}
```

# Error responses

REST error responses follow the usual error
[response format](error.md#error-responses):

```json
{
  "error": {
    "type": "DB_MODEL_NOT_FOUND",
    "title": "Model not found",
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