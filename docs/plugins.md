# Plugins

Plugins are functions that modify an [IDL file](idl.md) in a pre-defined way.

They are simple functions that takes as input:
  - `idl` `{object}`
  - `opts` `{object}`: plugin options
And return the new `idl` object.

The input arguments are immutable.

The function can be asynchronous by returning a promise.

Plugins can be configured under the top-level attribute `plugins`, which is
an array of objects with properties:
  - `plugin` [`{jsl}`](jsl.md) or `{string}` (for system plugins)
  - `opts` `{object}`: plugin-specific options
  - `enabled` `{boolean}`: defaults to true

The following system plugins are available: [`timestamp`](#timestamps)
and [`author`](#model-authors).

# Timestamps

The system plugin `timestamp` automatically adds the attributes:
  - `created_time` `{datetime}` - set on model's creation
  - `updated_time` `{datetime}` - set on model's modification

# Model authors

The system plugin `author` automatically adds the attributes:
  - `created_by` `{user}` - set on model's creation
  - `updated_by` `{user}` - set on model's modification

What must specify what `user` means with the plugin options:
  - `model` `{string}`: user's model name. Defaults to `'user'`
  - `user` [`{jsl}`](jsl.md): retrieves the current request's user.
    Defaults to `'(user())'`
