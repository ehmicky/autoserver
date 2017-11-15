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

The following HTTP request headers have specific interpretations:
  - `Content-Type`, `Accept` and `Accept-Charset` set the [format](formats.md)
    and the [charset](formats.md#charset) like the `format` and `charset` URL
    variables do.
  - `Prefer: return=minimal` sets the [`silent` argument](silent.md) to `true`
