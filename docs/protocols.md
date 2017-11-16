# Protocols

Several network protocols can be handled at the same time, each spawning
a single server.
By default, all protocols are spawned.

# Headers and method

Each protocol has its own way of handling the headers, the method, the URL and
the request payload.

For example, HTTP uses HTTP headers and HTTP method (e.g. `GET`).

# Protocols options

Each protocol has its own set of options, which are specified with the
[`run` option](configuration.md) `protocols`, e.g.:

```yml
protocols:
  http:
    port: 80
```

will launch a HTTP server on port `80`.

# Available protocols

  - [`http`](http.md): HTTP/1.1
