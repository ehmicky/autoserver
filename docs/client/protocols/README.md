# Protocols

Client requests can use several protocols (only HTTP at the moment).

Each protocol has its own way of specifying the request headers, method, URL
and payload.

For example, HTTP uses HTTP headers and HTTP method (e.g. `GET`).

The client request payload and the server response can use any of the following
[formats](formats.md): [JSON](formats.md#json), [YAML](formats.md#yaml),
[x-www-form-urlencoded](formats.md#x-www-form-urlencoded),
[raw](formats.md#raw), [Hjson](formats.md#hjson), [JSON5](formats.md#json5) and
[INI](formats.md#ini). Different [charsets](formats.md#charsets) can also be
used.

# Available protocols

  - [`http`](http.md): HTTP/1.1
