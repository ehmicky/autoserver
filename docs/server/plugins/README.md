# Plugins

The [configuration](../configuration/configuration.md) can be extended using
plugins.

Plugins are configured with the `plugins`
[configuration property](../configuration/configuration.md#properties), which
is an array of objects with properties:
  - `plugin` [`{function}`](../configuration/functions.md) or `{string}`
    (system plugins names)
  - `opts` `{object}`: plugin-specific options
  - `enabled` `{boolean}`: defaults to true

```yml
plugins:
- plugin: author
  opts:
    currentuser:
      $ref: get_user.js
    collection: users
- plugin: timestamp
  enabled: false
- plugin:
    $ref: custom_plugin.js
```

# System plugins

The following system plugins are available:
  - [`timestamp`](timestamp.md)
  - [`author`](author.md)

# Custom plugins

A plugin is simply a [function](../configuration/functions.md) that takes as
input:
  - `config` `{object}`
  - `opts` `{object}`: plugin options

And return the
[configuration properties](../configuration/configuration.md#properties) to
merge in.

The function can be asynchronous by returning a promise.

The input arguments are read-only.
