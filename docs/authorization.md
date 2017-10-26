# Readonly attributes

Readonly attributes cannot be modified.
Trying to do so won't report any error, but the attribute value will not change.

They can be specified using `attribute.readonly`, e.g.:

```yml
models:
  example_model:
    attributes:
      example_attribute:
        readonly: true
```

An attribute can be readonly based on a condition, by using a
[function](function.md) in `attribute.readonly`, e.g.:

```yml
models:
  example_model:
    attributes:
      name:
        readonly: ($model.locked === true)
      locked:
        type: boolean
```

this model's `name` attribute will be readonly only if its `locked` attribute is
`true`.
