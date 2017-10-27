# Authorization

It is possible to reject requests by specifying a condition on a specific model
with `model.authorize`.

`model.authorize` uses the same format as the [`filter`](filtering.md) query
argument, except attribute names are prefixed with `$model.`, e.g.:

```yml
models:
  example_model:
    authorize:
    - $model.age:
        ge: 30
    - $model.public: true
```

will reject requests on `example_model` unless `example_model.age` is over `30`,
or `example_model.public` is `true`.

Attributes are checked both on read and on write, e.g.:

```yml
models:
  example_model:
    authorize:
      $model.locked: false
```

will prevent requests from fetching any `example_model` with
`example_model.locked` `true`. It will also prevent requests from setting
`example_model.locked` to `true`, or creating such a model.

Using `$model.` allows you to define
[access control lists](https://en.wikipedia.org/wiki/Access_control_list)
restricting the permissions of a model based on the value of its attributes.

# Variables

One can also specify
[schema variables](functions.md#schema-functions-variables), including
[user variables](functions.md#user-variables), e.g.:

```yml
models:
  example_model:
    authorize:
      userGroup: admin
```

will only allow the `admin` group to query `example_model`.

Using variables allows you to define
[role-based access control](https://en.wikipedia.org/wiki/Role-based_access_control) or other
authorization design. E.g.:

```yml
models:
  example_model:
    authorize:
    - $command: find
      userGroup: reader
    - $command:
        in: [find, replace, patch]
      userGroup: manager
    - userGroup: admin
```

gives readonly permissions to the `reader` group, readwrite permissions
to the `manager` group, and full permissions to the `admin` group.

For `$params` and `$args`, the dot notation must be used, e.g. `$params.key`.

It is also possible to directly use [functions](functions.md), e.g.:

```yml
models:
  example_model:
    authorize:
      $params.key: (getSecretKey())
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
