# Error responses

Error responses contain an `error` property which is a standard
[RFC 7807](https://tools.ietf.org/rfc/rfc7807.txt) object with the following
properties:
  - `type` `{string}`: error type
  - `title` `{string}`: short description
  - `description` `{string}`: detailed description
  - `status` `{string}`: `CLIENT_ERROR` or `SERVER_ERROR`
  - `instance` `{string}`: URL path that was called
  - additional properties might be present, depending on the error type.
    See below for the list of additional properties for each error type.

`metadata.info` includes the same information as the
[`log` parameter](../../server/configuration/functions.md#parameters), providing
debugging information about the request.

```json
{
  "error": {
    "type": "NOT_FOUND",
    "title": "Some database models could not be found, e.g. the ids were invalid",
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
      "commandpaths": ["", "location"],
      "commandpath": "",
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
