# Exceptions, thrown in the server

Every [instruction](usage.md#instructions) will throw the same type of
exception if it fails.

Exceptions try to follow [RFC 7807](https://tools.ietf.org/rfc/rfc7807.txt):
  - `description` `{string}`
  - `title` `{string}`: short generic description
  - `type` `{string}`: error type
  - `status` `{string}`: protocol-agnostic status, among `'INTERNALS'`,
    `'SUCCESS'`, `'CLIENT_ERROR'` and `'SERVER_ERROR'`, usually one of the
    two last ones.
  - `instance` `{string}`: URL that was called, if any
  - `details` `{string}`: stack trace

# Error responses, sent to clients

Error responses contain a single `error` property, with same properties
[exceptions](#exceptions), except `details`.

The following properties may also appear, depending on when the error happened:
  - `protocolstatus` `${any}`: [`protocol`](protocols.md)-specific response
    status, e.g. HTTP status code
  - [`protocol`](protocols.md) `{string}`
  - `method` `{string}`
  - [`requestheaders`](protocols.md#headers-and-method) `{object}`
  - `queryvars` `{object}`
  - [`operation`](operations.md) `{string}`
  - `summary` `{string}`
  - `args` `{object}`
  - `commandpath` `{string}`
  - `model` `{string}`
  - `command` `{string}`
  - `requestid` `{string}`

Additional properties specific to a given error type might also be present.

For example:

```json
{
  "error": {
    "type": "DB_MODEL_NOT_FOUND",
    "title": "Model not found",
    "description": "The 'user' model with 'id' '20' could not be found",
    "instance": "http://localhost:5001/user/20",
    "status": "CLIENT_ERROR",
    "protocolstatus": 404,
    "protocol": "http",
    "method": "find",
    "requestheaders": {
      "host": "localhost:5001",
      "accept": "*/*",
      "accept-encoding": "deflate, gzip",
      "content-type": "application/json",
      "content-length": "481"
    },
    "queryvars": {},
    "operation": "rest",
    "summary": "find_user",
    "args": {
      "id": "20",
      "select": "id"
    },
    "commandpath": "find_user",
    "model": "user",
    "command": "find",
    "requestid": "8af50f41-40db-4109-b649-feef43107e56"
  }
}
```

# Error logging

See [here](events.md#error-information) for information about error logging.
