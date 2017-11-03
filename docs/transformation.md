# Computed attributes

Attributes can be calculated server-side by setting `attribute.value` to a
[function](functions.md) or a constant value, e.g.:

```yml
models:
  example_model:
    attributes:
      current_date:
        value: ($timestamp)
```

would set the `current_date` attribute, regardless of the value supplied by the
client.

# Combining attributes

By using the `$model` or `$val`
[variable](functions.md¤schema-functions-variables), this can also be used to
combine several attributes, e.g.:

```yml
models:
  example_model:
    attributes:
      first_name:
        type: string
      last_name:
        type: string
      name:
        value: ($model.first_name + ' ' + $model.last_name)
```

# Transformations

It can also be used to transform or normalize the value supplied by the client.
When doing so, please keep in mind that `$val` might be `undefined`, unless
`attribute.validate.required` is `true`, e.g.:

```yml
models:
  example_model:
    attributes:
      name:
        value: ($val.toLowerCase())
```

would fail when the client sets `name` to `undefined`. Instead, this should be:

```yml
models:
  example_model:
    attributes:
      name:
        value: '(typeof $val === "string" ? $val.toLowerCase() : $val)'
```
