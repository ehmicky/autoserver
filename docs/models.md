# Models

Models are the equivalent of a database table or collection.

Models keys are the name of the model.
The name is used in [commands](crud.md).

It must only be lowercase ASCII letters, digits or underscore.
It cannot start with one digit or two underscores.

# Attributes

Attributes are the equivalent of a database column, attribute or key.

Attribute keys are the name of the attribute, and follow the same naming rules
as models.

Attributes called `id` are special as they:
  - are used as primary key
  - must be required
  - are automatically added on model creation, unless specified

One can specify an `attribute.type` among:
  - `string` (default)
  - `integer`
  - `number`: i.e. float
  - `boolean`
  - `MODEL`: where `MODEL` is the model's name, e.g. `users`,
    for [nested models](#nested-models)
  - `string[]`, `integer[]`, `number[]`, `boolean[]` or `MODEL[]`: same but
    as an array.

# Nested models

See the documentation [here](relations.md).

# Default model

If a model is called `default`, it will not be used as a regular model, but
instead be deeply merged into each model.

E.g. to specify that each model's `name` should be required:

```yml
models:
  default:
    attributes:
      name:
        validate:
          required: true
```

# Empty values

Attributes with `undefined` or `null` values are considered empty, and are
treated the same way, and are converted to unset attributes.

I.e.:

<!-- eslint-skip -->
```js
{ "name": "Bob", "weight": null }
```

<!-- eslint-skip -->
```js
{ "name": "Bob", "weight": undefined }
```

<!-- eslint-skip -->
```js
{ "name": "Bob" }
```

are all treated the same way, and converted to the last form.

The exception is for [`patch`](crud.md#patch-command) commands, where `null`
is used to unset a value.
