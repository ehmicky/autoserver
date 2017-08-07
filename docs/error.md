# Error responses

Error responses try to follow both the
[GraphQL spec](https://facebook.github.io/graphql/#sec-Errors) and
[RFC 7807](https://tools.ietf.org/rfc/rfc7807.txt) with some
additional properties:
  - `errors` `{object[]}`:
    - `message` `{string}`
    - `title` `{string}`: short generic description
    - `type` `{string}`: error type
    - `status` `{string}` - protocol-specific status, e.g. `404`
    - `instance` `{string}`: URL that was called, if any
    - `stack` `{string}`: stack trace

The following properties may appear or not, depending on when the error
happened:
  - `request_id` `{string}`
  - `protocol` `{string}`
  - `method` `{string}`
  - `headers` `{object}`
  - `queryVars` `{object}`
  - `operation` `{string}`
  - `action` `{string}`
  - `action_path` `{string}`
  - `model` `{string}`
  - `args` `{object}`
  - `command` `{string}`

Additional properties specific to a given error type might also be present.

# Error logging

See [here](logging.md#error-information) for information about error logging.
