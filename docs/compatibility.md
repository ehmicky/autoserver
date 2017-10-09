# Aliases

Attributes can specify alternative names that clients can use, e.g. for
backward compatibility, using the [schema](schema.md) property
`attribute.alias`, which can be a string or an array of strings, e.g.:

```yml
weight:
  alias: [old_weight_name, older_weight_name]
```
