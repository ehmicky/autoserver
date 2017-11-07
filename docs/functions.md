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
  - [`$protocol`](protocols.md) `{string}`: possible values are only `http`
  - `$timestamp` `{string}`: current date and time
  - `$ip` `{string}`: request IP
  - `$requestid` `{string}`: UUID identifying the current request
  - `$params` `{object}`: all [client parameters](#client-parameters)
  - [`$rpc`](rpc.md) `{string}`: possible values are `graphql`,
    `graphiql`, `graphqlprint`
  - `$modelname` `{string}`: name of the [model](models.md), e.g. `user`
  - `$args` `{object}`: client [arguments](rpc.md#command-and-arguments)
    passed to the request, e.g. `filter`
  - `$command` `{string}`: current command, among `create`, `find`, `upsert`,
    `patch` or `delete`
  - `$val` `{any}`: value of the current attribute.
    E.g. `$val === 'John'` checks whether the current value equals `'John'`
  - `$model` `{object}`: current model.
    E.g. `$model.first_name === 'John'` checks whether the model's `first_name`
    equals `'John'`
  - `$previousval` `{any}`: value of the attribute.
    If the current request is modified the current attribute, `$previousval`
    is the value before that modification, and `$val` after that modification.
  - `$previousmodel` `{object|undefined}`: model.
    If the current request is modified the current model, `$previousmodel` is
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
  secret_password: admin
```

The user variable `secret_password` can be used in any schema function:

<!-- eslint-disable strict, filenames/match-exported, camelcase -->
```js
const getDefaultValue = function ({ secret_password }) {
  return secret_password === 'admin' ? 1 : 0;
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
  example_function: '(my_math_func(1, 10, 100, 2))'
  my_math_func: (($1 * $2) + ($3 * $4))
  birth_date: 2005-01-01
  my_custom_func:
    $ref: custom_func.js
  lodash:
    $ref: lodash.node
  constants:
    $ref: constants.json
```

# Client parameters

Clients can specify their own
[schema function variables](#schema-functions-variables) on any specific
request, using the [argument](rpc.md#command-and-arguments) `params`
with an object value, e.g.:

```graphql
query {
  find_user(id: "1", params: { password: "admin" }) {
    id
  }
}
```

Client parameters will be available using the
[system variable](#schema-functions-variables) `$params` as an object.
