# Aliases

Attributes can specify alternative names that clients can use, e.g. for
backward compatibility, using the [IDL file](idl.md) property
`attribute.alias`, which can be a string or an array of strings, e.g.:

```yml
weight:
  alias: [old_weight_name, older_weight_name]
```
