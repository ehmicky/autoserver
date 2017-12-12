# HTTP

HTTP is one of the available [protocols](client/syntax/protocols.md).

Engine-specific headers, e.g. [`params`](client/arguments/params.md), must be prefixed
with `X-Apiengine-`, e.g. `X-Apiengine-Params`.

The following HTTP request headers have specific interpretations:
  - `Content-Type` and `Accept` set the [format](../client/arguments/formats.md) and the
    [charset](../client/arguments/formats.md#charset) like the `format` and `charset`
    query variables do.
  - `Accept-Encoding` sets the response's [compression](client/arguments/compression.md)
    like the `compress` query variable does.
  - `Content-Encoding` sets the request payload's
    [compression](client/arguments/compression.md) like the `compress` query variable
    does.
  - `Prefer: return=minimal` sets the [`silent`](client/arguments/silent.md)
    [argument](client/syntax/rpc.md#rpc) to `true`. Same thing for the `HEAD` method.
  - `X-HTTP-Method-Override: METHOD` overrides the current HTTP method
    (which must be `POST`)

The following HTTP response headers might be set, depending on the response:
  - `Content-Type`, `Content-Length`, `Vary`, `Allow`, `X-Response-Time`
  - when using [REST](client/syntax/rest.md) and the response is paginated, a
    `Link` header
    will be set with `rel` `first`, `last`, `prev` and/or `next`. The header
    contains the full URI to retrieve the first, last, previous or next batch,
    as opposed to `metadata.pages` which only contain the cursor tokens.
