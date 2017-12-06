# Data validation

Attributes can be validated by specifying the [schema](schema.md) property
`attribute.validate`.

`attribute.validate` is a standard [JSON schema](http://json-schema.org/),
version 6:
  - the following keywords are available:
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
      - `format` `{string}`: among `'regex'`, `'date-time'`, `'date'`,
        `'time'`, `'email'`, `'hostname'`, `'ipv4'`, `'ipv6'`, `'uri'`,
        `'uri-reference'`, `'json-pointer'`, `'relative-json-pointer'`
      - `formatMaximum` `{string}`, `formatMinimum` `{string}`,
        `formatExclusiveMaximum` `{boolean}`,
        `formatExclusiveMinimum` `{boolean}`: only if `format` is `date`, `time`
        or `date-time`.
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
      - `dependencies` `{string[]}`: attributes that are required
        for the current attribute to be defined.
    - used as combinators:
      - `not` `{json_schema}`
      - `allOf` `{json_schema[]}`
      - `anyOf` `{json_schema[]}`
      - `oneOf` `{json_schema[]}`
      - `if` `{json_schema}`, `then` `{json_schema}`, `else` `{json_schema}`
  - the following properties are not available: `type`, `description`,
    `examples`, `default`, `title`, `$id`, `$schema`, `$ref`, `definitions`
  - since attributes cannot be objects, the following properties are also
    not available: `maxProperties`, `minProperties`, `additionalProperties`,
    `properties`, `patternProperties`, `propertyNames`

E.g.:

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

If the pre-defined validation keywords are not sufficient, one can define
custom ones, using the top-level `validation` property.

This property is an object of validation keywords, where the key is the
keyword name and the value an object with the properties:
  - `test` [`{function}`](functions.md): function that returns false
    if the validation failed.
    The [system variable](functions.md#variables)
    `arg` represents the value passed to the keyword, and `value` represents the
    value to validate.
  - `message` [`{string|function}`](functions.md): error message.
    Can be [functions](functions.md) with the
    [system variable](functions.md#variables) `arg`
    Must start with `'must '`
  - `type` `{string[]}`: optionally restrict the attributes types that can
    use that keyword
