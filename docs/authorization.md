# Authorization

The possible CRUD commands can be restricted for a given model by specifying
in the [schema](schema.md) property `model.commands` among
`create`, `find`, `replace` and `delete`.

`patch` is a combination of both `find` and `replace` permissions, so it does
not need to be specified.

For example, to prevent users from creating users:

```yml
models:
  example_model:
    commands: [find, replace, delete]
```

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
