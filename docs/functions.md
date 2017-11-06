# Schema functions

Custom logic can be added by using functions in the [schema](schema.md).

Not all schema properties can use functions. The following properties can use
either a function or a constant as value:
  - [`attribute.authorize`](authorization.md)
  - [`attribute.readonly`](authorization.md#readonly-attributes)
  - [`attribute.default`](default.md)
  - [`attribute.value`](transformation.md)
  - [custom validation keywords](validation.md#custom-validation)

Schema functions should be pure, i.e. no global variable should be used, and
it should not create side-effects.

Functions can take two forms: [external](#external-functions) or
[inline](#inline-functions).

# External functions

External functions are regular JavaScript files exporting a function and
required using a
[JSON reference](https://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03),
e.g.:

<!-- eslint-disable strict, filenames/match-exported -->
```js
const getDefaultValue = function () {
  return Math.random();
};

module.exports = getDefaultValue;
```

and in the schema:

```yml
models:
  example_model:
    attributes:
      example_attribute:
        default:
          $ref: src/get_default_value.js
```

# Inline functions

You can also directly write JavaScript functions inside the schema, e.g.:

```yml
models:
  example_model:
    attributes:
      example_attribute:
        default: (Math.random())
```

Only the function body should be specified, and it should be wrapped in
parenthesis.

# Schema functions variables

The following system variables are always passed to schema functions as their
first argument, as an object:
  - `$protocol` `{string}`: possible values are only `http`
  - `$timestamp` `{string}`: current date and time
  - `$ip` `{string}`: request IP
  - `$requestId` `{string}`: UUID identifying the current request
  - `$params` `{object}`: all [client parameters](#client-parameters)
  - `$operation` `{string}`: possible values are `graphql`, `graphiql`,
    `graphqlprint`
  - `$modelName` `{string}`: name of the [model](models.md), e.g. `user`
  - `$args` `{object}`: client arguments passed to the request, e.g. `filter`
  - `$command` `{string}`: current command, among `create`, `find`, `upsert`,
    `patch` or `delete`
  - `$val` `{any}`: value of the current attribute.
    E.g. `$val === 'John'` checks whether the current value equals `'John'`
  - `$model` `{object}`: current model.
    E.g. `$model.first_name === 'John'` checks whether the model's `first_name`
    equals `'John'`
  - `$previousVal` `{any}`: value of the attribute.
    If the current request is modified the current attribute, `$previousVal`
    is the value before that modification, and `$val` after that modification.
  - `$previousModel` `{object|undefined}`: model.
    If the current request is modified the current model, `$previousModel` is
    the value before that modification, and `$model` after that modification.
    If the current request is creating the model (with a `create` or `upsert`
    action), this will be `undefined`.
  - `$expected` `${any}`: value passed as argument to the custom validation
    keyword. Only available to
    [custom validation](validation.md#custom-validation) keyword:

E.g.:

<!-- eslint-disable strict, filenames/match-exported -->
```js
const getDefaultValue = function ({ $timestamp }) {
  return $timestamp;
};

module.exports = getDefaultValue;
```

Those can be also be used when the function is inline, e.g.:

```yml
models:
  example_model:
    attributes:
      example_attribute:
        default: ($timestamp)
```

# User variables

User variables behave like system variables, except they are specified using the
`variables` schema property, which is an object containing all user variables.

E.g. if the schema specifies:

```yml
variables:
  secretPassword: admin
```

The user variable `secretPassword` can be used in any schema function:

<!-- eslint-disable strict, filenames/match-exported -->
```js
const getDefaultValue = function ({ secretPassword }) {
  return secretPassword === 'admin' ? 1 : 0;
};

module.exports = getDefaultValue;
```

User variables can be functions themselves:
  - the other variables will be passed as their first argument, like any
    other schema function. I.e. user variables can use system variables or
    each other.
  - if the function is [inline](#inline-functions), positional arguments will
    be passed as variables `$1`, `$2`, etc.

For example:

```yml
variables:
  exampleFunction: '(myMathFunc(1, 10, 100, 2))'
  myMathFunc: (($1 * $2) + ($3 * $4))
  birthDate: 2005-01-01
  myCustomFunc:
    $ref: custom_func.js
  _s:
    $ref: lodash.node
  constants:
    $ref: constants.json
```

# Client parameters

Clients can specify their own
[schema function variables](#schema-functions-variables) on any specific
request, using the argument `params` with an object value, e.g.:

```graphql
query {
  find_user(id: "1", params: { password: "admin" }) {
    id
  }
}
```

[Protocol](protocols.md) headers starting with `X-Apiengine-Param-` can also
be used, with a JSON string as value. The header name case will be converted to
lowercase with underscores.
E.g. using the header `X-Apiengine-Param-Custom-Count: 5` is the same as
specifying `params: { custom_count: 5 }`

In either case, client parameters will be available using the
[system variable](#schema-functions-variables) `$params` as an object.
