# Default values

Default values for attributes can be specified with the `attribute.default`
[configuration property](../configuration/configuration.md#properties).

```yml
collections:
  example_collection:
    attributes:
      example_attribute:
        default: 200
```

They will be used for `create` and `upsert` commands.

[Functions](../configuration/functions.md) can be used.

```yml
collections:
  example_collection:
    attributes:
      example_attribute:
        default: (timestamp)
```
