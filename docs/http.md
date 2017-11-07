# HTTP server options

The HTTP server has the following [options](protocols.md#protocols-options.md):

```yml
protocols:
  http:
    hostname: localhost
    port: 80
```

  - `hostname` `{string}` (defaults to `localhost`)
  - `port` `{integer}` (defaults to `80`). Can be `0` for "any available port".

# Arguments

In addition to the usual way of setting them, the following arguments can also
be set using HTTP semantics:
  - the [`silent` argument](silent.md) will be `true` if either:
    - the standard HTTP header `Prefer: return=minimal` is set
    - the HTTP method `HEAD` is used instead of `GET`
