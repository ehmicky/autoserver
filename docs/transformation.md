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
`attr.transform`.

# Computed attributes

Attributes can be computed on output, but not stored in database, by specifying
`attr.compute`.
