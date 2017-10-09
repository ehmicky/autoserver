# Plugins

Plugins are functions that modify a [schema](schema.md) in a pre-defined way.

They are simple functions that takes as input:
  - `schema` `{object}`
  - `opts` `{object}`: plugin options
And return the new `schema` object.

The input arguments are immutable.

The function can be asynchronous by returning a promise.

Plugins can be configured under the top-level attribute `plugins`, which is
an array of objects with properties:
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
  - `currentUser` [`{function}`](functions.md): retrieves the current
    request's user. Cannot return null if the user is anonymous.
  - `userModel` `{string}`: user's model name.
