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
    [charset](formats.md#charset) like the `format` and `charset` URL variables
    do.
  - `Prefer: return=minimal` sets the [`silent` argument](silent.md) to `true`
    Same thing for the `HEAD` method.
  - `X-HTTP-Method-Override: METHOD` overrides the current HTTP method 
    (which must be `POST`)

The following HTTP response headers might be set, depending on the response:
`Content-Type`, `Content-Length`, `Vary`, `Allow`, `X-Response-Time`.
