# Plugins

Plugins are functions that modify a [configuration](configuration.md) in a
pre-defined way.

They are simple functions that takes as input:
  - `config` `{object}`
  - `opts` `{object}`: plugin options
And return [configuration properties](configuration.md#properties) to merge.

The input arguments are read-only.

The function can be asynchronous by returning a promise.

Plugins can be configured with the `plugins`
[configuration property](configuration.md#properties), which is an array of objects with
properties:
  - `plugin` [`{function}`](functions.md) or `{string}` (for system plugins)
  - `opts` `{object}`: plugin-specific options
  - `enabled` `{boolean}`: defaults to true

The following system plugins are available: [`timestamp`](#timestamps)
and [`author`](#model-authors).

# Timestamps

The system plugin `timestamp` automatically adds the attributes:
  - `created_time` `{datetime}` - set on model's creation
  - `updated_time` `{datetime}` - set on model's modification

It is enabled by default.

# Model authors

The system plugin `author` automatically adds the attributes:
  - `created_by` `{user}` - set on model's creation
  - `updated_by` `{user}` - set on model's modification

It is not enabled by default.

The following plugin options must be specified:
  - `currentuser` [`{function}`](functions.md): retrieves the current
    request's user. Cannot return null if the user is anonymous.
  - `collection` `{string}`: user's collection name.
