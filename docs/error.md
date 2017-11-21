# Exceptions, thrown in the server

Every [instruction](usage.md#instructions) will throw the same type of
exception if it fails.

Exceptions try to follow [RFC 7807](https://tools.ietf.org/rfc/rfc7807.txt):
  - `type` `{string}`: error type
  - `title` `{string}`: short generic description
  - `description` `{string}`
  - `status` `{string}`: `'CLIENT_ERROR'` or `'SERVER_ERROR'`
  - `instance` `{string}`: URL path that was called
  - `details` `{string}`: stack trace

# Error responses, sent to clients

Error responses contain a single `error` property, with same properties
[exceptions](#exceptions), except `details`.

The following properties may also appear, depending on when the error happened:
  - `origin` `{string}`
  - [`protocol`](protocols.md) `{string}`
  - `method` `{string}`
  - `queryvars` `{object}`
  - `headers` `{object}`
  - `payloadsize` `{integer}` - `undefined` if no payload was sent
  - [`format`](formats.md) `{string}`
  - [`charset`](formats.md#charsets) `{string}`
  - [`compress`](compression.md) `{string}`
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
    "status": "CLIENT_ERROR",
    "instance": "/rest/users/20",
    "origin": "http://localhost:5001",
    "protocol": "http",
    "method": "GET",
    "queryvars": {},
    "headers": {},
    "format": "json",
    "charset": "utf-8",
    "compress": "gzip,identity",
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
