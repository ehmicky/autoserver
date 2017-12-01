# Schema functions

Custom logic can be added by using functions in the [schema](schema.md).

The following schema properties can use functions:
  - [`attribute.authorize`](authorization.md)
  - [`attribute.readonly`](authorization.md#readonly-attributes)
  - [`attribute.default`](default.md)
  - [`attribute.value`](transformation.md)
  - [custom validation keywords](validation.md#custom-validation)
  - [custom patch operators](patch.md#custom-operators)

Everywhere a schema function can be used, a constant value can also be used.

Schema functions should be pure, i.e. no global variable should be used, and
it should not create side-effects.

# Defining functions

Functions are regular JavaScript files exporting a function and required using a
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
collections:
  example_collection:
    attributes:
      example_attribute:
        default:
          $ref: src/get_default_value.js
```

# Inline functions

You can also directly write JavaScript functions inside the schema, e.g.:

```yml
collections:
  example_collection:
    attributes:
      example_attribute:
        default: (Math.random())
```

Only the function body should be specified (without the leading `return`
keyword), and it should be wrapped in parenthesis.

# Schema functions variables

Every schema functions receives as their first argument an object containing
system variables.

The following variables are available to any schema function:
  - [`protocol`](protocols.md) `{string}`: possible values are only `http`
  - `timestamp` `{string}`: current date and time, e.g.
    `2017-12-01T10:54:19.500Z`
  - `ip` `{string}`: request IP
  - `requestid` `{string}`: UUID identifying the current request
  - [`rpc`](rpc.md) `{string}`: possible values are `graphql`,
    `graphiql`, `graphqlprint`, `rest` or `jsonrpc`.
  - `args` `{object}`: client [arguments](rpc.md#rpc) passed to the request,
    e.g. `filter`

The following variables are available to any schema function except
[user variables](#user-variables):
  - `command` `{string}`: current command, among `create`, `find`, `upsert`,
    `patch` or `delete`
  - `collection` `{string}`: name of the [collection](collections.md),
    e.g. `users`

The following variables are available to any schema function except
[user variables](#user-variables) and
[custom patch operators](patch.md#custom-operators):
  - `val` `{any}`: value of the current attribute.
    E.g. `val === 'John'` checks whether the current value equals `'John'`
  - `model` `{object}`: current model.
    E.g. `model.first_name === 'John'` checks whether the model's `first_name`
    equals `'John'`
  - `previousval` `{any}`: value of the attribute.
    If the current request is modified the current attribute, `previousval`
    is the value before that modification, and `val` after that modification.
  - `previousmodel` `{object|undefined}`: model.
    If the current request is modified the current model, `previousmodel` is
    the value before that modification, and `model` after that modification.
    If the current request is creating the model (with a `create` or `upsert`
    action), this will be `undefined`.

The following variables are available for more specific cases:
  - `params`: all [client parameters](#client-parameters)
  - `arg1`, `arg2`, etc.: see [user variables](#user-variables)
  - `expected`: see [custom validation](validation.md#custom-validation)
  - `arg`, `type`: see [custom patch operators](patch.md#custom-operators)

For example:

<!-- eslint-disable strict, filenames/match-exported -->
```js
const getDefaultValue = function ({ timestamp }) {
  return timestamp;
};

module.exports = getDefaultValue;
```

Those can be also be used when the function is inline, e.g.:

```yml
collections:
  example_collection:
    attributes:
      example_attribute:
        default: (timestamp)
```

# User variables

User variables behave like system variables, except they are specified using the
`variables` schema property, which is an object containing all user variables.

E.g. if the schema specifies:

```yml
variables:
  $secret_password: admin
```

The user variable `$secret_password` can be used in any schema function:

<!-- eslint-disable strict, filenames/match-exported, camelcase -->
```js
const getDefaultValue = function ({ $secret_password }) {
  return $secret_password === 'admin' ? 1 : 0;
};

module.exports = getDefaultValue;
```

User variables can be functions themselves:
  - schema variables (including other user variables) will be passed as
    the first argument like any other schema function
  - positional arguments are passed using the variables `arg1`, `arg2`, etc.
  - schema variables will be available only for user variables that are
    functions, as opposed to objects with function members.

For example:

```yml
variables:
  $example_function: '($my_math_func(1, 10, 100, 2))'
  $my_math_func: ((arg1 * arg2) + (arg3 * arg4))
  $birth_date: 2005-01-01
  $my_custom_func:
    $ref: custom_func.js
  $lodash:
    $ref: lodash.node
  $constants:
    $ref: constants.json
```

# Client parameters

Clients can specify their own
[schema function variables](#schema-functions-variables) on any specific
request, using the [argument](rpc.md#rpc) `params` with an object value, e.g.:

```graphql
query {
  find_users(id: "1", params: { password: "admin" }) {
    id
  }
}
```

Client parameters will be available using the
[system variable](#schema-functions-variables) `params` as an object.

They can also be set using the
[protocol header](protocols.md#headers-and-method) `params`, with a JSON object
as value. For example, with HTTP:

```HTTP
X-Apiengine-Params: {"password": "admin"}
```
