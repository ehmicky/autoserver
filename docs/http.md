# HTTP server options

HTTP is one of the available [protocols](protocols.md).

The HTTP server has the following [options](protocols.md#protocols-options.md):

```yml
protocols:
  http:
    hostname: localhost
    port: 80
```

  - `hostname` `{string}` (defaults to `localhost`)
  - `port` `{integer}` (defaults to `80`). Can be `0` for "any available port".

# HTTP headers

Engine-specific headers, e.g. [`params`](functions.md#client-parameters), must
be prefixed with `X-Apiengine-`, e.g. `X-Apiengine-Params`.

The following HTTP request headers have specific interpretations:
  - `Content-Type` and `Accept` set the [format](formats.md) and the
    [charset](formats.md#charset) like the `format` and `charset` query
    variables do.
  - `Accept-Encoding` sets the response's [compression](compression.md) like the
    `compress` query variable does.
  - `Content-Encoding` sets the request payload's [compression](compression.md)
    like the `compress` query variable does.
  - `Prefer: return=minimal` sets the [`silent` argument](silent.md) to `true`
    Same thing for the `HEAD` method.
  - `X-HTTP-Method-Override: METHOD` overrides the current HTTP method
    (which must be `POST`)

The following HTTP response headers might be set, depending on the response:
  - `Content-Type`, `Content-Length`, `Vary`, `Allow`, `X-Response-Time`
  - when using [REST](rest.md) and the response is paginated, a `Link` header
    will be set with `rel` `first`, `last`, `prev` and/or `next`. The header
    contains the full URI to retrieve the first, last, previous or next batch,
    as opposed to `metadata.pages` which only contain the cursor tokens.
