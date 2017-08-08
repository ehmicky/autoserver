# Models

Models are the equivalent of a database table or collection.

Models keys are the name of the model.
The name is used in routes, e.g. in GraphQL actions.
It must only be lowercase ASCII letters, digits or underscore.
It cannot start with one digit or two underscores.

# Attributes

Attributes are the equivalent of a database column, attribute or key.

Attribute keys are the name of the attribute, and follow the same naming rules
as models.

Attributes called `id` are special as they:
  - are used as primary key
  - must be required
  - are automatically added (but can be overridden)

One can specify an `attribute.type` among:
  - `string` (default)
  - `integer`
  - `number`: i.e. float
  - `boolean`
  - `MODEL`: where `MODEL` is the model's name, e.g. `user`,
    for [nested models](#nested-models)
  - `string[]`, `integer[]`, `number[]`, `boolean[]` or `MODEL[]`: same but
    as an array.

# Nested models

Models can refer to each other by using the other model's name as
`attribute.type`, either as a scalar value or an array, for one-to-one or
one-to-many relationship.

Models can nest themselves, i.e. be recursive.

Such attributes should be `id`s to the target model, and will use the same
constraints as the target model's `id` attribute.

Clients can nest actions by using nested models.

# Default model

If a model is called `default`, it will not be used as a regular model, but
instead be deeply merged into each model.

E.g. to specify that each model's `id` should be an integer:

```yml
models:
  default:
    attributes:
      id:
        type: integer
```

# Empty values

Attributes with `undefined` or `null` values are considered empty, and are
treated the same way, and are converted to unset attributes.

I.e.:

```js
{ "name": "Bob", "weight": null }
```

```js
{ "name": "Bob", "weight": undefined }
```

```js
{ "name": "Bob" }
```

are all treated the same way, and converted to the last form.
