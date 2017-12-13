# Collections

Collections are the equivalent of a database table or entity.

# Name

The name of a collection corresponds to its key in the `collections`
[configuration property](../configuration/configuration.md#properties).

In the example below, it is `users`:

```yml
collections:
  users:
    attributes: {}
```

It is possible to differentiate between the name used server-side (anywhere in
the [configuration](../configuration/configuration.md)) and client-side
(in URLs, method names, error responses and documentation) by specifying the
`collection.name`
[configuration property](../configuration/configuration.md#properties).

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


```yml
collections:
  users:
    name: [users, players]
    attributes: {}
```

# Attributes

Attributes are the equivalent of a database column or key.

The name of an attribute corresponds to its key in the `collection.attributes`
[configuration property](../configuration/configuration.md#properties). It
follows the same naming rules as collections.

In the example below, there is an attribute named `age`:

```yml
collections:
  users:
    attributes:
      age: {}
```

Attributes called `id` are special as they:
  - are used as primary key
  - must be [`required`](validation.md)
  - are automatically created by the system, but can be overriden

# Attribute type

One can specify an `attribute.type` among:
  - `string` (default)
  - `integer`
  - `number`: includes both floating number and integer
  - `boolean`
  - `COLLECTION`: where `COLLECTION` is the collection's name, e.g. `users`,
    for [nested collections](relations.md)
  - `string[]`, `integer[]`, `number[]`, `boolean[]` or `COLLECTION[]`: same but
    as an array

# Default collection

If a collection is called `default`, it will not be used as a regular
collection, but instead be deeply merged into each collection.

In the example below, each model's `name` will be required, and the
[`mongodb` database](../databases/mongodb.md) will be used by default.

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

Attributes with `undefined` or `null` values are considered empty, are treated
the same way and are converted to unset attributes.

Each example below is treated the same way and converted to the last form.

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

The exception is for [`patch`](../../client/query/crud.md#patch-command)
commands, where `null` is used to unset a value.
