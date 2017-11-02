# Default values

Default values can be specified with the [schema](schema.md) property
`attribute.default`, e.g.:

```yml
models:
  example_model:
    attributes:
      example_attribute:
        default: 200
```

They will be used for `create` and `upsert` commands.

# Transformations

Attributes can be applied transformations on input by specifying
`attribute.transform`, which should be a [function](functions.md).

E.g. to normalize name's case:

```yml
models:
  example_model:
    attributes:
      name:
        transform: ($val.toLowerCase())
```

Transformations will not be applied if the current attribute value is
[empty](models.md#empty-values).

# Computed attributes

Attributes can be calculated server-side, e.g. combining other attributes,
by specifying `attribute.value`, which should be a [function](functions.md) or
a constant value.

E.g. to set an attribute to the current time:

```yml
models:
  example_model:
    attributes:
      current_date:
        value: ($timestamp)
```

Computed attributes ignore any value supplied by the client, e.g. the
[system variable](functions.md#schema-functions-variables) `$val` is not
available (but `$model` is).
