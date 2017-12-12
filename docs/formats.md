# Formats

Multiple formats are supported for the
[configuration file](configuration.md#configuration-file),
the client request payloads and the server responses: [JSON](#json),
[YAML](#yaml), [x-www-form-urlencoded](#x-www-form-urlencoded), [raw](#raw),
[JavaScript](#javascript), [Hjson](#hjson), [JSON5](#json5) and [INI](#ini).

Most of the examples in this documentation use [YAML](#yaml) for the
[configuration properties](configuration.md#properties) and [JSON](#json)
for the the client request payloads and the server responses.

# Request and responses

To specify which format to use in both the client request payload (if any is
present) and the server response, use the query variable `?format=FORMAT` in
the request URL, where `FORMAT` is `json`, `yaml`, `urlencoded`, `raw`, `hjson`,
`json5` or `ini`.

[JavaScript](#javascript) is not available for request payloads and server
responses.

# Charsets

Multiple [character sets](terminology.md#charset) are supported in the
client request payload (if any is present). The response is always in UTF-8.

To specify which one to use, set the query variable `?charset=CHARSET` in the
request URL.

See [here](https://github.com/ashtuchkin/iconv-lite/wiki/Supported-Encodings)
for a full list of supported charsets. Common ones include `utf-8`, `utf-16`,
`ascii`, `binary`, `base64` and `hex`.

By default, no charset decoding is performed.

# JSON

This is the default format.

```json
{
  "limits": {
    "pagesize": 10
  },
  "protocols": {
    "http": {
      "hostname": "myhostname"
    }
  }
}
```

# YAML

Only JSON-compatible YAML is allowed. In particular the types `!!set`,
`!!map`, `!!omap`, `!!pairs`, `!!seq`, `!!binary`, `undefined`, `regexp` and
`function` are not allowed.

```yml
# Comment

limits:
  pagesize: 10
protocols:
  http:
    hostname: myhostname
```

# x-www-form-urlencoded

This is the format used in JavaScript's `FormData` or by default in HTML's
`<form>`.

```HTTP
limits.pagesize=10&protocols.http.hostname=myhostname
```

# Raw

Any format that does not require specific parsing, including images,
videos, unstructured text files and binary files.

As opposed to the other formats, this is only used for the request payload.
The server response will be using the default format, i.e. JSON.

# JavaScript

<!-- eslint-disable strict, filenames/match-exported, comma-dangle -->
```js
// Comment

const configuration = {
  limits: {
    pagesize: 10
  },
  protocols: {
    http: {
      hostname: 'myhostname'
    }
  }
};

module.exports = configuration;
```

# Hjson

[Superset of JSON](https://hjson.org/).

```yml
// Comment

{
  limits: {
    pagesize: 10
  }
  protocols: {
    http: {
      hostname: myhostname
    }
  }
}
```

# JSON5

[Superset of JSON](http://json5.org/).

```yml
// Comment

{
  limits: {
    pagesize: 10
  },
  protocols: {
    http: {
      hostname: 'myhostname'
    },
  }
}
```

# INI

```ini
# Comment

[limits]

pagesize=10

[protocols.http]

hostname=myhostname
```
