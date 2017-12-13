# Protocols

Several network protocols can be handled at the same time, each spawning
a single server. By default, all protocols are spawned.

# Options

Each protocol has its own set of options, which are specified with the
`protocols` [configuration property](../usage/configuration.md#properties).

```yml
protocols:
  http:
    port: 80
```

will launch a HTTP server on port `80`.

# Available protocols

  - [`http`](../protocols/http.md): HTTP/1.1
