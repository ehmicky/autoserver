# Collections

Collections are the equivalent of a database table or collection.

# Name

The name of a collection corresponds to its key in the `collections`
[configuration property](server/usage/configuration.md#properties).

In the example below, it is `users`:

```yml
collections:
  users:
    attributes: {}
```

It is possible to differentiate between the name used server-side (anywhere in
the [configuration](server/usage/configuration.md)) and client-side (in URLs, method names,
error responses and documentation) by specifying the `collection.name`
[configuration property](server/usage/configuration.md#properties).

In the example below, the server-side name is `users` and the client-side name
is `players`:

```yml
collections:
  users:
    name: players
    attributes: {}
```

It is also possible to specify several client-side names, which will behave
as aliases, by using an array of names in `collection.name`.

# Attributes

Attributes are the equivalent of a database column, attribute or key.

The name of an attribute corresponds to its key in the `collection.attributes`
[configuration property](server/usage/configuration.md#properties). It follows the same naming rules as
collections.

In the example below, there is an attribute named `age`:

```yml
collections:
  users:
    attributes:
      age: {}
```

Attributes called `id` are special as they:
  - are used as primary key
  - must be [`required`](server/configuration/validation.md)
  - are automatically created by the system, but can be overriden

One can specify an `attribute.type` among:
  - `string` (default)
  - `integer`
  - `number`: floating number
  - `boolean`
  - `COLLECTION`: where `COLLECTION` is the collection's name, e.g. `users`,
    for [nested collections](#nested-collections)
  - `string[]`, `integer[]`, `number[]`, `boolean[]` or `COLLECTION[]`: same but
    as an array.

# Nested collections

See the documentation [here](server/configuration/relations.md).

# Default collection

If a collection is called `default`, it will not be used as a regular
collection, but instead be deeply merged into each collection.

In the example below, each model's `name` will be required, and the
[`mongodb` database](server/databases/mongodb.md) will be used by default:

```yml
collections:
  default:
    database: mongodb
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

The exception is for [`patch`](client/query/crud.md#patch-command) commands, where `null`
is used to unset a value.
