# Authorization

It is possible to reject requests by specifying a condition with
`schema.authorize`.

`schema.authorize` uses the same format as the [`filter`](filtering.md) query
argument, except [schema variables](functions.md#schema-functions-variables),
including [user variables](functions.md#user-variables), are specified instead
of models attributes, e.g.:

```yml
schema:
  authorize:
    $command:
      _neq: delete
```

will forbid delete commands on the API.

With `schema.authorize`, one can define
[role-based access control](https://en.wikipedia.org/wiki/Role-based_access_control) or other
authorization design. E.g.:

```yml
schema:
  authorize:
  - $command: find
    userGroup: reader
  - $command:
      _in: [find, patch]
    userGroup: manager
  - userGroup: admin
```

gives readonly permissions to the `reader` group, readwrite permissions
to the `manager` group, and full permissions to the `admin` group.

For `$params` and `$args`, the dot notation must be used, e.g. `$params.key`.

It is also possible to directly use [functions](functions.md), e.g.:

```yml
schema:
  authorize:
    $params.key: (getSecretKey())
```

However those functions cannot use the variables `$model`, `$val`,
`$previousModel` nor `$previousVal`.

# Model authorization

One can specify model-specific authorization with `model.authorize`.

The format is the same as `schema.authorize`, except model's attributes can
also be specified, prefixed with `$model.`, e.g.:

```yml
models:
  example_model:
    authorize:
    - $model.age:
        _gte: 30
    - $model.public: true
```

will reject requests on `example_model` unless `example_model.age` is over `30`,
or `example_model.public` is `true`.

If the model is being modified, attributes are checked both before and after
modification. In other words, it is checked on both `$oldModel` and `$model`
[variables](functions.md#schema-functions-variables)). E.g.:

```yml
models:
  example_model:
    authorize:
      $model.locked: false
```

will prevent requests from fetching any `example_model` with
`example_model.locked` `true`. It will also prevent requests from setting
`example_model.locked` to `true`, or creating such a model.

Using this feature allows you to define
[access control lists](https://en.wikipedia.org/wiki/Access_control_list)
restricting the permissions of a model based on the value of its attributes.

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
