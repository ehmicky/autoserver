# Authorization

It is possible to reject requests by specifying a condition with
`schema.authorize`.

`schema.authorize` uses the same format as the [`filter`](filtering.md) query
[argument](rpc.md#rpc), except [function variables](functions.md#variables),
including [server-specific variables](functions.md#server-specific-variables),
are specified instead of collection's attributes, e.g.:

```yml
schema:
  authorize:
    command:
      _neq: delete
```

will forbid delete commands on the API.

With `schema.authorize`, one can define
[role-based access control](https://en.wikipedia.org/wiki/Role-based_access_control) or other
authorization design. E.g.:

```yml
schema:
  authorize:
  - command: find
    user_group: reader
  - command:
      _in: [find, patch]
    user_group: manager
  - user_group: admin
```

gives readonly permissions to the `reader` group, readwrite permissions
to the `manager` group, and full permissions to the `admin` group.

It is also possible to directly use [functions](functions.md), e.g.:

```yml
schema:
  authorize:
    params:
      key: (getSecretKey())
```

# Collection authorization

One can specify collection-specific authorization with `collection.authorize`.

The format is the same as `schema.authorize`, except `model` can also be used,
e.g.:

```yml
collections:
  example_collection:
    authorize:
    - model:
        age:
          _gte: 30
    - model:
        public: true
```

will reject requests on `example_collection` unless `example_collection.age`
is over `30`, or `example_collection.public` is `true`.

If the model is being modified, attributes are checked both before and after
modification. In other words, it is checked on both `previousmodel` and
`model` [variables](functions.md#variables)). E.g.:

```yml
collections:
  example_collection:
    authorize:
      model:
        locked: false
```

will prevent requests from fetching any `example_collection` with
`example_collection.locked` `true`. It will also prevent requests from setting
`example_collection.locked` to `true`, or creating such a model.

Using this feature allows you to define
[access control lists](https://en.wikipedia.org/wiki/Access_control_list)
restricting the permissions of a model based on the value of its attributes.

Functions cannot use the variables `model`, `value`, `previousmodel` nor
`previousvalue`. However, it is possible to target another attribute by using
a `model.ATTRIBUTE` string as value, e.g.:

```yml
collections:
  example_collection:
    authorize:
      model:
        created_time: model.updated_time
```

will only reject requests on any `example_collection` unless
`example_collection.created_time` equals `example_collection.updated_time`.

# Readonly attributes

Readonly attributes cannot be modified.
Trying to do so won't report any error, but the attribute value will not change.

They can be specified using `attribute.readonly`, e.g.:

```yml
collections:
  example_collection:
    attributes:
      example_attribute:
        readonly: true
```

An attribute can be readonly based on a condition, by using a
[function](function.md) in `attribute.readonly`, e.g.:

```yml
collections:
  example_collection:
    attributes:
      name:
        readonly: (model.locked === true)
      locked:
        type: boolean
```

this model's `name` attribute will be readonly only if its `locked` attribute is
`true`.
