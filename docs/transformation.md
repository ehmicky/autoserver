# Computed attributes

Attributes can be calculated server-side by setting the `attribute.value`
[schema property](schema.md#properties) to a [function](functions.md).

```yml
collections:
  example_collection:
    attributes:
      current_date:
        value: (timestamp)
```

would set the `current_date` attribute, regardless of the value supplied by the
client.

# Combining attributes

By using the `model` or `value`
[variable](functions.md¤variables), this can also be used to
combine several attributes.

```yml
collections:
  example_collection:
    attributes:
      first_name:
        type: string
      last_name:
        type: string
      name:
        value: (model.first_name + ' ' + model.last_name)
```

# Transformations

It can also be used to transform or normalize the value supplied by the client.

When doing so, please keep in mind that `value` might be `undefined`, unless
`attribute.validate.required` is `true`.

```yml
collections:
  example_collection:
    attributes:
      name:
        value: (value.toLowerCase())
```

would fail when the client sets `name` to `undefined`. Instead, this should be:

```yml
collections:
  example_collection:
    attributes:
      name:
        value: '(typeof value === "string" ? value.toLowerCase() : value)'
```
