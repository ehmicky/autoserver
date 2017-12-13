# Custom operators

It is possible to specify custom
[patch operators](../../client/query/patch.md#available-operators) with the
`operators` [configuration property](../configuration/configuration.md#properties).

```yml
operators:
  __power:
    apply: (value ** (arg || 1))
    attribute: [number, integer]
    argument: [number, integer, empty]
```

The key (here `__power`) is the operator's name. The value is an object with
four properties: `apply`, `check`, `attribute` and `argument`. Only `apply`
is required, but `attribute` and `argument` are recommended.

## `apply` property

`apply` is the [function](../configuration/functions.md) performing the
transformation.
It must return the new value after the transformation has been applied.
Besides the regular [parameters](../configuration/functions.md#parameters), the
following parameters can be used:
  - `value`: the current value of the attribute, i.e. before transformation
  - `arg`: the argument passed to the patch operator
  - `type`: the attribute's type, e.g. `string` or `integer`

## `attribute` property

`attribute` is the list of [attribute types](collections.md#attribute-type)
that can use this operator.

For example, an `__power` operator can only be used on numerical attributes,
i.e. `integer` and `number`.

The possible values are: `string`, `number`, `integer`, `boolean`, `any`,
`string[]`, `number[]`, `integer[]`, `boolean[]` and `any[]`.

## `argument` property

`argument` is the list of possible types for the argument of this operator.

For example, a `__power` operator must take a single numerical value as
argument, i.e. `integer` and `number`. We might also allow an `empty`
argument if there is a default argument value.

The possible values are the same as `attribute` with the following additional
types: `empty`, `empty[]`, `object` and `object[]`.

If several arguments must be passed, it should be done by specifying an array
argument. To specify an array argument with mixed types, use several array
types. For example `argument: ['number[]', 'string[]']` requires the argument
to be an array containing either numbers, strings or a mix of them.

Remember that the `number` argument excludes integers. Use both the `number`
and the `integer` types if you want to allow any floating number.

## `check` property

`check` is a [function](../configuration/functions.md) applied to validate the
argument of the patch operator. It should be used if the `argument` property is
not flexible enough, e.g. if the argument is required to be a positive integer.

If the validation succeeds, it should not return anything. Otherwise, it
should return the error message as a string.

The same [parameters](../configuration/functions.md#parameters) as `apply` are
available, with the exception of `value`.

## Throwing errors

Neither the `apply` nor the `check` property should throw errors.
Use the `attribute`, `argument` and `check` properties for validation instead.

## Empty values

When defining the `apply` and `check` properties, remember that:
  - the `value` [parameter](../configuration/functions.md#parameters) might be
    `undefined`, unless the attribute is a required attribute.
  - the operator's argument can only be `null` if the `argument` property is
    omitted or if it specifies `empty`. When the argument is `empty`, the
    `arg` [parameter](../configuration/functions.md#parameters) will be
    `undefined`.
