# Collections

Collections are the equivalent of a database table or collection.

# Name

Collections name are used in [commands](crud.md).

The name of a collection corresponds to its key, e.g. in:

```yml
collections:
  users:
    attributes: {}
```

it is `users`.

It is possible to differentiate between the name used server-side (anywhere in
the schema) and client-side (in URLs, method names, error responses and
documentation) by specifying `collection.name`, e.g. in:

```yml
collections:
  users:
    name: players
    attributes: {}
```

the server-side name is `users` and the client-side name is `players`.

It is also possible to specify several client-side names, which will behave
as aliases, by using an array of names in `collection.name`.

# Attributes

Attributes are the equivalent of a database column, attribute or key.

Attribute keys are the name of the attribute, and follow the same naming rules
as collections.

Attributes called `id` are special as they:
  - are used as primary key
  - must be required
  - are automatically added on model creation, unless specified

One can specify an `attribute.type` among:
  - `string` (default)
  - `integer`
  - `number`: i.e. float
  - `boolean`
  - `COLLECTION`: where `COLLECTION` is the collection's name, e.g. `users`,
    for [nested collections](#nested-collections)
  - `string[]`, `integer[]`, `number[]`, `boolean[]` or `COLLECTION[]`: same but
    as an array.

# Nested collections

See the documentation [here](relations.md).

# Default collection

If a collection is called `default`, it will not be used as a regular
collection, but instead be deeply merged into each collection.

E.g. to specify that each model's `name` should be required:

```yml
collections:
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
