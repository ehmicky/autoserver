# Default values

Default values for attributes can be specified with the `attribute.default`
[schema property](schema.md).

```yml
collections:
  example_collection:
    attributes:
      example_attribute:
        default: 200
```

They will be used for `create` and `upsert` commands.

[Functions](functions.md) can be used.

```yml
collections:
  example_collection:
    attributes:
      example_attribute:
        default: (timestamp)
```
