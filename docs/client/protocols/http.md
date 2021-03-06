# HTTP

HTTP is one of the available [protocols](README.md).

Engine-specific headers, e.g. [`params`](../arguments/params.md), must be
prefixed with `X-Autoserver-`, e.g. `X-Autoserver-Params`.

The following HTTP request headers have specific interpretations:

- `Content-Type` and `Accept` set the [format](../protocols/formats.md) and the
  [charset](../protocols/formats.md#charsets) like the `format` and `charset`
  query variables do.
- `Accept-Encoding` sets the response's
  [compression](../arguments/compression.md) like the `compress` query variable
  does.
- `Content-Encoding` sets the request payload's
  [compression](../arguments/compression.md) like the `compress` query variable
  does.
- `Prefer: return=minimal` sets the [`silent`](../arguments/silent.md)
  [argument](../rpc/README.md#rpc) to `true`. Same thing for the `HEAD` method.
- `X-HTTP-Method-Override: METHOD` overrides the current HTTP method    (which
  must be `POST`)

The following HTTP response headers might be set, depending on the response:

- `Content-Type`, `Content-Length`, `Vary`, `Allow`, `X-Response-Time`
- when using [REST](../rpc/rest.md) and the response is paginated, a `Link`
  header will be set with `rel` `first`, `last`, `prev` and/or `next`. The
  header contains the full URI to retrieve the first, last, previous or next
  batch, as opposed to `metadata.pages` which only contain the cursor tokens.

# Error responses

The HTTP status code of error responses depends on the
[error type](../request/error.md#error-types). See the previous link for a list
of the status codes used.
