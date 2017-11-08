# Endpoint

REST is one of the available [RPC systems](rpc.md).

Clients can query the GraphQL server at either
`//hostname:port/rest/MODELS/` or `//hostname:port/rest/MODELS/ID`, where
`MODELS` represents the model's name and `ID` its `id` attribute.

# Command

The [command](rpc.md#command-and-arguments) is guessed from the model's name
in the URL, and from the HTTP method:
  - `GET` uses the [`find`](crud.md#command-find) command
  - `POST` uses the [`create`](crud.md#command-create) command
  - `PUT` uses the [`upsert`](crud.md#command-upsert) command
  - `PATCH` uses the [`patch`](crud.md#command-patch) command
  - `DELETE` uses the [`delete`](crud.md#command-delete) command

For any of the above commands, if an `ID` is present in the URL, only one
model will be targeted. Otherwise, several models will be.

# Arguments

The [arguments](rpc.md#command-and-arguments) are specified using URL query
variables.

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
GET /rest/users/2
```

would respond with:

```json
{
  "data": {
    "id": "1",
    "name": "Anthony",
    "manager": "3"
  }
}
```

The following request:

```HTTP
GET /rest/users/?filter.name=Anthony
```

would respond with:

```json
{
  "data": [{
    "id": "1",
    "name": "Anthony",
    "manager": "3"
  }]
}
```

The following request:

```HTTP
POST /rest/users/

{
  "id": "1",
  "name": "Anthony",
  "manager": "3"
}
```

would respond with:

```json
{
  "data": {
    "id": "1",
    "name": "Anthony",
    "manager": "3"
  }
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
    "description": "The 'user' model with 'id' '20' could not be found",
    "instance": "http://localhost:5001/rest/users/20",
    "status": "CLIENT_ERROR",
    "protocolstatus": 404,
    "protocol": "http",
    "method": "find",
    "requestheaders": {
      "host": "localhost:5001",
      "accept": "*/*",
      "accept-encoding": "deflate, gzip"
    },
    "queryvars": {},
    "rpc": "rest",
    "summary": "find_user",
    "args": {
      "id": "20"
    },
    "commandpath": "find_user",
    "model": "user",
    "command": "find",
    "requestid": "509683e7-5957-4712-a9b7-3f54c443936e"
  }
}
```
