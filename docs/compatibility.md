# Aliases

Attributes can specify alternative names that clients can use, e.g. for
backward compatibility, using the [schema](schema.md) property
`attribute.alias`, which can be a string or an array of strings, e.g.:

```yml
models:
  example_model:
    attributes:
      example_attribute:
        alias: [old_attribute_name, older_attribute_name]
```
