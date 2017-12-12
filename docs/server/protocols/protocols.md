# Protocols

Several network protocols can be handled at the same time, each spawning
a single server. By default, all protocols are spawned.

# Protocols options

Each protocol has its own set of options, which are specified with the
`protocols` [configuration property](server/usage/configuration.md#properties).

```yml
protocols:
  http:
    port: 80
```

will launch a HTTP server on port `80`.

# Available protocols

  - [`http`](server/protocols/http.md): HTTP/1.1
