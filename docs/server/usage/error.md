# Exceptions

Exceptions are standard [RFC 7807](https://tools.ietf.org/rfc/rfc7807.txt)
objects with the following properties:
  - `type` `{string}`: error type
  - `title` `{string}`: short generic description
  - `description` `{string}`
  - `status` `{string}`: `'CLIENT_ERROR'` or `'SERVER_ERROR'`
  - `instance` `{string}`: URL path that was called
  - `details` `{string}`: stack trace
  - additional properties might be present, depending on the error type

When an [instruction](README.md) fails, an exception will be thrown.

When a client-side or server-side error occurs, an exception will be
[logged](../quality/logging.md) using the
[`error` parameter](../quality/logging.md#functions-parameters).
