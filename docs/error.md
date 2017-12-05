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

`metadata.info` includes the same information as the
[`log` schema variable](functions.md#schema-functions-variables), providing
debugging information about the request.

For example:

```json
{
  "error": {
    "type": "DB_MODEL_NOT_FOUND",
    "title": "Model not found",
    "description": "The 'users' model with 'id' '20' could not be found",
    "status": "CLIENT_ERROR",
    "instance": "/rest/users/"
  },
  "metadata": {
    "requestid": "56ca9a87-73cc-48db-95fa-ec62e2dee812",
    "duration": 15,
    "info": {
      "timestamp": "2017-12-05T17:05:45.806Z",
      "protocol": "http",
      "ip": "127.0.0.1",
      "origin": "http://localhost:5001",
      "path": "/rest/users/",
      "method": "PUT",
      "status": "CLIENT_ERROR",
      "queryvars": {},
      "headers": {},
      "format": "json",
      "charset": "utf-8",
      "compress": "identity,identity",
      "payload": [
        { "id": "20" },
        { "id": "21" }
      ],
      "payloadsize": 105,
      "payloadcount": 2,
      "rpc": "rest",
      "args": {
        "data": [
          { "id": "20", "name": "Anthony" },
          { "id": "21", "name": "David" }
        ]
      },
      "params": {},
      "datasize": 105,
      "datacount": 2,
      "summary": "users{location}",
      "commandpaths": ["users", "users.location"],
      "commandpath": "users",
      "collections": ["users", "geolocation"],
      "collection": "users",
      "command": "upsert",
      "responsedata": {},
      "responsedatasize": 170,
      "responsetype": "error"
    }
  }
}
```

# Error logging

See [here](events.md#error-information) for information about error logging.
