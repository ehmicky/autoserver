# Endpoint

[REST](https://en.wikipedia.org/wiki/Representational_state_transfer)
is one of the available [RPC systems](rpc.md).

Clients can query the GraphQL server at either
`//hostname:port/rest/COLLECTION/` or `//hostname:port/rest/COLLECTION/ID`,
where `COLLECTION` represents the collection's name and `ID` its `id` attribute.

# Command

The [command](rpc.md#rpc) is guessed from the collection's name
in the URL, and from the HTTP method:
  - `GET` uses the [`find`](crud.md#find-command) command
  - `HEAD` uses the [`find`](crud.md#find-command) command, but with the
    [`silent`](silent.md) argument set to `true`
  - `POST` uses the [`create`](crud.md#create-command) command
  - `PUT` uses the [`upsert`](crud.md#upsert-command) command
  - `PATCH` uses the [`patch`](crud.md#patch-command) command
  - `DELETE` uses the [`delete`](crud.md#delete-command) command

If an `ID` is present in the URL, the response will be an object instead of
an array of objects. Also the `ID` will be used as the
[`id`](filtering.md#id-argument) argument.

# Arguments

The [arguments](rpc.md#rpc) are specified using URL query
variables, except for the `data` argument, which corresponds to the full
request payload.

Objects and arrays can be specified using a dot notation, e.g.
`filter.0.name=David` is parsed as `filter: [{ "name": "David" }]`.

Values can be either an unquoted string or any JSON value. To differentiate
between a number (e.g. `filter.weight=5`) and a string (e.g. `filter.id="5"`),
surround the number with double quotes.

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
[response format](error.md#error-responses-sent-to-clients):

```json
{
  "error": {
    "type": "DB_MODEL_NOT_FOUND",
    "title": "Model not found",
    "description": "The 'users' model with 'id' '20' could not be found",
    "instance": "http://localhost:5001/rest/users/20",
    "status": "CLIENT_ERROR",
    "protocol": "http",
    "method": "GET",
    "queryvars": {},
    "requestheaders": {
      "host": "localhost:5001",
      "accept": "*/*",
      "accept-encoding": "deflate, gzip"
    },
    "format": "json",
    "charset": "utf-8",
    "rpc": "rest",
    "summary": "find_users",
    "args": {
      "id": "20"
    },
    "commandpath": "find_users",
    "collection": "users",
    "command": "find"
  },
  "metadata": {
		"requestid": "56ca9a87-73cc-48db-95fa-ec62e2dee812",
		"serverid": "0f7d6a6e-2912-4f26-8cc8-3be68d5da257"
	}
}
```
