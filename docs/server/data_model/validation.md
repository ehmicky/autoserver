# Data validation

Attributes can be validated by using the `attribute.validate`
[configuration property](../configuration/configuration.md#properties).

`attribute.validate` is a standard [JSON schema](http://json-schema.org),
version 7.

The following keywords are available:
  - for attributes of type `integer` or `number`:
    - `multipleOf` `{float}`
    - `maximum` `{float}`: `<=`
    - `exclusiveMaximum` `{float}`: `<`
    - `minimum` `{float}`: `>=`
    - `exclusiveMinimum` `{float}`: `>`
  - for attributes of type `string`:
    - `maxLength` `{integer}`: `<=`
    - `minLength` `{integer}`: `>=`
    - `pattern` `{regex}`
    - `format` `{string}`: among `regex`, `date-time`, `date`, `time`, `email`,
      `hostname`, `ipv4`, `ipv6`, `uri`, `uri-reference`, `uri-template`,
      `json-pointer`, `relative-json-pointer`
  - for attributes of array type:
    - `maxItems` `{integer}`: `<=`
    - `minItems` `{integer}`: `>=`
    - `uniqueItems` `{boolean}`: no duplicate
    - `contains` `{json_schema}`: at least one item is valid
    - `items` `{json_schema}`: all items are valid
    - `additionalItems` `{json_schema}`
  - for any attribute:
    - `const` `{any}`: must equal that value
    - `enum` `{any[]}`: must equal one of those values
    - `required` `{boolean}`: checked on `upsert` and `create` commands.
    - `dependencies` `{string|string[]}`: attributes that are required
      for the current attribute to be defined.
  - used as combinators:
    - `not` `{json_schema}`
    - `allOf` `{json_schema[]}`
    - `anyOf` `{json_schema[]}`
    - `oneOf` `{json_schema[]}`
    - `if` `{json_schema}`, `then` `{json_schema}`, `else` `{json_schema}`

The following properties have a slightly different syntax than in
[JSON schema](http://json-schema.org): `required`, `dependencies`.

The following properties are not available or are available under a different
[configuration property](../configuration/configuration.md#properties): `type`,
`description`, `examples`, `default`, `title`, `$id`, `$schema`, `$comment`, `readOnly`, `contentMediaType`, `contentEncoding`, `definitions`.

Since attributes cannot be objects, the following properties are also
not available: `maxProperties`, `minProperties`, `additionalProperties`,
`properties`, `patternProperties`, `propertyNames`

# Example

```yml
collections:
  example_collection:
    attributes:
      example_attribute:
        validate:
          required: true
          minimum: 10
          multipleOf: 2
```

# Custom validation

If the JSON schema validation keywords are not sufficient, one can define
custom ones using the `validation`
[configuration property](../configuration/configuration.md#properties).

This property is an object of validation keywords, where the key is the
keyword name and the value an object with the properties:
  - `test` [`{function}`](../configuration/functions.md): function that returns
    `false` if the validation failed.
    The [parameter](../configuration/functions.md#parameters) `arg` represents
    the value passed to the keyword, and `value` represents the value to
    validate.
  - `message` [`{string|function}`](../configuration/functions.md):
    error message.
    Can be [functions](../configuration/functions.md) with the
    [parameter](../configuration/functions.md#parameters) `arg`.
    Must start with `'must '`
  - `type` `{string[]}`: optionally restrict the attributes types that can
    use that keyword

```yml
validation:
  $is_not_equal:
    test: (value !== arg)
    message: (`must not be equal to ${arg}`)
    type: number
```
