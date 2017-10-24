# Schema functions

Custom logic can be added by using functions in the schema.

Schema functions can be used in many parts of the [schema](schema.md):
  - on attributes' [transforms](transformation.md#transformations)
  - on attributes' [default values](transformation.md#default-values)
  - on [custom validation keywords](validation.md#custom-validation)

Functions can take two forms: [inline](#inline-functions)
or [external](#external-functions).

# Inline functions

It basically is inline JavaScript with few differences:
  - the function should be pure, i.e.:
    - global state should not be accessed, e.g. `window` or `global`
    - should not create side-effects, which includes variable declarations and
      assignments
  - some variables are available for ease of use

To differentiate it from regular strings, inline functions must be wrapped in
parenthesis.
The first parenthesis can be escaped if we actually want a regular string
wrapped in parenthesis. E.g.:
  - this is not an inline function: `1 + 1`
  - this is an inline function: `(1 + 1)`
  - this is not an inline function: `\(1 + 1)`

Constants can be always be used instead of an inline function.

# External functions

One can use regular JavaScript files instead of inlining it. Files can be
required using
[JSON references](https://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03),
e.g.:

```yml
default:
  $ref: src/my_external_function.js
```

External functions can only be used inside the [schema](schema.md).

# Schema function variables

The following variables are available:
  - `$protocol` `{string}`: possible values are only `http`
  - `$timestamp` `{string}`: current date and time
  - `$ip` `{string}`: request IP
  - `$requestId` `{string}`: UUID identifying the current request
  - `$params` `{object}`: all [parameters](#schema-function-parameters)
  - `$operation` `{string}`: possible values are `graphql`, `graphiql`,
    `graphqlprint`
  - `$modelName` `{string}`: name of the [model](models.md), e.g. `user`
  - `$args` `{object}`: arguments passed by client to the request
  - `$command` `{string}`: current command, among `create`, `find`, `replace`,
    `patch` or `delete`
  - `$val` `{any}`: value of current attribute
    E.g. `'($val !== "John")'`
    checks whether `model.name !== 'John'`
  - `$model` `{object}`: current model (input or output),
    E.g. `'($val === $model.first_name)'`
    checks whether `model.name === model.first_name`

The following variable is available only to
[custom validation](validation.md#custom-validation) keyword:
  - `$expected` `${any}`: value passed as argument to the custom validation
    keyword

# Schema function helpers

Helpers are functions that can be used in any schema functions,
as any other schema functions variable.

They are specified under the top-level properties
`helpers`, which can be an array of objects (which are merged) or a single
object. Each object is a map of schema function helpers, with:
  - the key being the helper's name
  - the value being either the helper's value, of an object with properties:
    - `value` `{function}`
    - `useVars` `{boolean}` (default: `false`): pass other schema function
      variables as first argument to helper function

They can use the same schema function variables as the function that calls them.
If the helper is external function, the schema option `useVars` must be used to
pass the schema function variables as first argument, and the helpers as second
argument.

Inline functions can also use positional arguments, passed as schema function
variables `$1`, `$2`, etc.

Schema function helpers can call each other.

They must be pure functions.

Example:

```yml
helpers:
  - myMathFunc: (($1 * $2) + ($3 * $4))
    exampleFunction: '(myMathFunc(1, 10, 100, 2))'
    birthDate: 2005-01-01
    myOtherMathFunc:
      value:
        $ref: math_func.js
      useVars: true
  - $ref: lodash
  - $ref: constants.json
```

# Schema function parameters

Clients can specify their own schema function variables on any specific request,
using the argument `params` with an object value, e.g.:

```graphql
mutation {
  find_user(filter: {id: "1"}, params: { password: "admin" }) {
    id
  }
}
```

Those will be available using the schema function variable `$params`.
E.g. the previous example would set `$params.password` to `"admin"`.
