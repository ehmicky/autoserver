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
  - additional properties might be present, depending on the error type

# Error responses, sent to clients

Error responses contain an `error` property with the same properties as
[exceptions](#exceptions), except `details`.

For example:

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
		"requestid": "56ca9a87-73cc-48db-95fa-ec62e2dee812"
	}
}
```

# Error logging

See [here](events.md#error-information) for information about error logging.
