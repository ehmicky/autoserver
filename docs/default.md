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
