# Formats

Multiple formats are supported for:
  - the [configuration files](configuration.md): [JSON](#json), [YAML](#yaml),
    [Hjson](#hjson) and [INI](#ini)
  - the client request payloads and the server responses: [JSON](#json),
    [YAML](#yaml), [x-www-form-urlencoded](#x-www-form-urlencoded),
    [raw](#raw) and [Hjson](#hjson)
  - the [in-memory database](memory_db.md#options): [JSON](#json),
    [YAML](#yaml) and [Hjson](#hjson)

Most of the examples in this documentation use YAML for the configuration files
and JSON for the the client request payloads and the server responses.

# Request and responses

To specify which format to use in both the client request payload (if any is
present) and the server response, use the URL query variable `?format=FORMAT`,
where `FORMAT` is `json`, `yaml`, `urlencoded` or `raw`.

# Charsets

Multiple [character sets](terminology.md#charset) are supported in both the
client request payload (if any is present) and the server response.

To specify which one to use, set the URL query variable `?charset=CHARSET`.

See [here](https://github.com/ashtuchkin/iconv-lite/wiki/Supported-Encodings)
for a full list of supported charsets. Common ones include `utf-8`, `utf-16`,
`ascii`, `binary`, `base64` and `hex`.

By default, no charset encoding/decoding is performed.

# JSON

This is the default format. For example:

```json
{
  "maxpagesize": 10,
  "protocols": {
    "http": {
      "hostname": "myhostname"
    }
  },
  "filter": {
    "payload": ["id", "old_id"]
  }
}
```

# YAML

Only JSON-compatible YAML is allowed. In particular the types `!!set`,
`!!map`, `!!omap`, `!!pairs`, `!!seq`, `!!binary`, `undefined`, `regexp` and
`function` are not allowed.

For example:

```yml
# Comment

maxpagesize: 10
protocols:
  http:
    hostname: myhostname
filter:
  payload: [id, old_id]
```

# x-www-form-urlencoded

This is the format used in JavaScript's `FormData` or by default in HTML's
`<form>`.

```HTTP
maxpagesize=10&protocols.http.hostname=myhostname&filter.payload=%5Bid,old_id%5D
```

# Raw

Any format that does not require specific parsing, including images,
videos, unstructured text files and binary files.

As opposed to the other formats, this is only used for the request payload.
The server response will be using the default format, i.e. JSON.

# Hjson

[Superset of JSON](https://hjson.org/). Example:

```yml
// Comment

{
  maxpagesize: 10
  protocols: {
    http: {
      hostname: myhostname
    }
  }
  filter: {
    payload: ['id', 'old_id']
  }
}
```

# INI

Example:

```ini
# Comment

maxpagesize=10

[protocols.http]

hostname=myhostname

[filter]

payload[]=id
payload[]=old_id
```
