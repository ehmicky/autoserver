# Default values

Default values can be specified with the [schema](schema.md) property
`attribute.default`, e.g.:

```yml
collections:
  example_collection:
    attributes:
      example_attribute:
        default: 200
```

They will be used for `create` and `upsert` commands.
