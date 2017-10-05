# Default values

Default values can be specified in the [IDL file](idl.md)
under `attribute.default`, e.g.:

```yml
weight:
  default: 200
```

They will be used for `create` and `replace` commands.

# Transformations

Attributes can be applied transformations on input by specifying
`attr.transform`, which should be a [function](functions.md).

E.g. to normalize name's case:

```yml
name:
  transform: ($.toLowerCase())
```

Transformations will not be applied if the current attribute value is
[empty](models.md#empty-values).

# Computed attributes

Attributes can be calculated server-side, e.g. combining other attributes,
by specifying `attr.value`, which should be a [function](functions.md).

E.g. to set an attribute to the current time:

```yml
current_date:
  value: ($TIMESTAMP)
```

Computed attributes ignore any value supplied by the client, e.g. the
[IDL function variable](functions.md#idl-function-variables) `$` is not
available (but `$$` is).
