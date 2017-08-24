# Default values

Default values can be specified in the [IDL file](idl.md)
under `attribute.default`, e.g.:

```yml
weight:
  default: 200
```

They will be used for `create`, `replace` and `upsert` actions.

# Transformations

Attributes can be applied transformations on input by specifying
`attr.transform` or `attr.value`.
Both specify the transformation to apply as [functions](functions.md).

E.g. to normalize name's case:

```yml
name:
  transform: ($.toLowerCase())
```

Or to set an attribute to the current time:

```yml
current_date:
  value: ($TIMESTAMP)
```

The difference between `transform` and `value` is:
  - `transform` is meant to modify an existing attribute value.
    It will not be applied if the current attribute value is
    [empty](models.md#empty-values).
  - `value` is meant to generate a value, regardless of the current one.
    The [IDL function variable](functions.md#idl-function-variables)
    `$` is not available (but `$$` is).

# Computed attributes

Attributes can be computed on output only (i.e. not stored in database),
by specifying `attr.compute`.

The syntax and restrictions are almost the same as `attr.value`, e.g.:

```yml
full_name:
  compute: ($$.first_name + $$.last_name)
```

Computed attributes cannot use `attr.transform`, `attr.default`
nor `attr.validate`.
