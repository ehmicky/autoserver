# Default values

Default values can be specified with the [schema](schema.md) property
`attribute.default`, e.g.:

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
  value: ($timestamp)
```

Computed attributes ignore any value supplied by the client, e.g. the
[schema function variable](functions.md#schema-function-variables) `$` is not
available (but `$$` is).
