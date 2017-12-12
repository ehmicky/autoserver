# Aliases

Attributes can specify alternative names that clients can use, e.g. for
backward compatibility, using the `attribute.alias`
[schema property](schema.md#properties), which can be a string or an array of
strings.

```yml
collections:
  example_collection:
    attributes:
      example_attribute:
        alias: [old_attribute_name, older_attribute_name]
```
