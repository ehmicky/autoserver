# Exceptions, thrown in the server

Every [instruction](usage.md#instructions) will throw the same type of
exception if it fails.

Exceptions try to follow [RFC 7807](https://tools.ietf.org/rfc/rfc7807.txt):
  - `type` `{string}`: error type
  - `title` `{string}`: short generic description
  - `description` `{string}`
  - `instance` `{string}`: URL that was called, if any
  - `status` `{string}`: `'CLIENT_ERROR'` or `'SERVER_ERROR'`
  - `details` `{string}`: stack trace

# Error responses, sent to clients

Error responses contain a single `error` property, with same properties
[exceptions](#exceptions), except `details`.

The following properties may also appear, depending on when the error happened:
  - [`protocol`](protocols.md) `{string}`
  - `method` `{string}`
  - `queryvars` `{object}`
  - [`requestheaders`](protocols.md#headers-and-method) `{object}`
  - [`format`](formats.md) `{string}`
  - [`charset`](formats.md#charsets) `{string}`
  - [`rpc`](rpc.md) `{string}`
  - `summary` `{string}`
  - `args` `{object}`
  - `commandpath` `{string}`
  - `collection` `{string}`
  - `command` `{string}`

Additional properties specific to a given error type might also be present.

For example:

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

# Error logging

See [here](events.md#error-information) for information about error logging.
