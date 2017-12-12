# HTTP server options

HTTP is one of the available [protocols](server/protocols/protocols.md).

The HTTP server has the following [options](server/protocols/protocols.md#protocols-options.md).

```yml
protocols:
  http:
    hostname: localhost
    port: 80
```

  - `hostname` `{string}` (defaults to `localhost`)
  - `port` `{integer}` (defaults to `80`). Can be `0` for "any available port".
