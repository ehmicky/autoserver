# Exceptions, thrown in the server

Every [instruction](usage.md#instructions) will throw the same type of
exception if it fails.

Exceptions somewhat follow [RFC 7807](https://tools.ietf.org/rfc/rfc7807.txt):
  - `description` `{string}`
  - `title` `{string}`: short generic description
  - `type` `{string}`: error type
  - `status` `{string}`: protocol-agnostic status, among `'INTERNALS'`,
    `'SUCCESS'`, `'CLIENT_ERROR'` and `'SERVER_ERROR'`, usually one of the
    two last ones.
  - `instance` `{string}`: URL that was called, if any
  - `details` `{string}`: stack trace

# Error responses, sent to clients

Error responses try to follow both the
[GraphQL spec](https://facebook.github.io/graphql/#sec-Errors) and
[RFC 7807](https://tools.ietf.org/rfc/rfc7807.txt) with some
additional properties:
  - `errors` `{object[]}`:
    - contains the same properties as the [exceptions](#exceptions)
      except `description` is called `message`, and `details` is called `stack`.
    - the following properties may also appear, depending on when
      the error happened:
      - `request_id` `{string}`
      - `protocol` `{string}`
      - `method` `{string}`
      - `headers` `{object}`
      - `queryVars` `{object}`
      - `operation` `{string}`
      - `operation_summary` `{string}`
      - `action` `{string}`
      - `command_path` `{string}`
      - `model` `{string}`
      - `args` `{object}`
      - `command` `{string}`
    - additional properties specific to a given error type might also be
      present.

Also the stack trace `details` is never included.

# Error logging

See [here](events.md#error-information) for information about error logging.
