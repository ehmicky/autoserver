# Authorization

It is possible to reject requests by specifying a condition with
the `authorize` [configuration property](../configuration/configuration.md#properties).

`authorize` uses the same format as the
[`filter`](../../client/arguments/filtering.md) query
[argument](../../client/syntax/rpc.md#rpc), except
[parameters](../configuration/functions.md#parameters), including
[server-specific parameters](../configuration/functions.md#server-specific-parameters),
are specified instead of collection's attributes.

```yml
authorize:
  command:
    _neq: delete
```

will forbid delete commands on the API.

With `authorize`, one can define
[role-based access control](https://en.wikipedia.org/wiki/Role-based_access_control)
or other authorization design.

```yml
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

It is also possible to directly use [functions](../configuration/functions.md).

```yml
authorize:
  params:
    key: (getSecretKey())
```

# Collection authorization

One can specify collection-specific authorization with the
`collection.authorize`
[configuration property](../configuration/configuration.md#properties).

The format is the same as `authorize`, except `model` can also be used.

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
`model` [parameters](../configuration/functions.md#parameters).

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

Functions cannot use the [parameters](../configuration/functions.md#parameters) `model`,
`value`, `previousmodel` nor `previousvalue`. However, it is possible to target
another attribute by using a `model.ATTRIBUTE` string as value.

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

They can be specified using `attribute.readonly`.

```yml
collections:
  example_collection:
    attributes:
      example_attribute:
        readonly: true
```

An attribute can be readonly based on a condition, by using a
[function](../configuration/functions.md) in `attribute.readonly`.

In the example below, the model's `name` attribute will be readonly only if its
`locked` attribute is `true`.

```yml
collections:
  example_collection:
    attributes:
      name:
        readonly: (model.locked === true)
      locked:
        type: boolean
```
