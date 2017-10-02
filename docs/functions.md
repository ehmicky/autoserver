# IDL functions

Custom logic can be added by using functions in the IDL file.

IDL functions can be used in many parts of the [IDL file](idl.md):
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

External functions can only be used inside the [IDL file](idl.md).

# IDL function variables

The following variables are available:
  - `$PROTOCOL` `{string}`: possible values are only `http`
  - `$TIMESTAMP` `{string}`: current date and time
  - `$IP` `{string}`: request IP
  - `$REQUEST_ID` `{string}`: UUID identifying the current request
  - `$PARAMS` `{object}`: all [parameters](#idl-function-parameters)
  - `$OPERATION` `{string}`: possible values are `graphql`, `graphiql`,
    `graphqlprint`
  - `$MODEL` `{string}`: name of the [model](models.md), e.g. `user`
  - `$ARGS` `{object}`: arguments passed by client to the specific action
  - `$COMMAND` `{string}`: current command, among `create`, `read`, `replace`,
    `patch` or `delete`
  - `$` `{any}`: value of current attribute
    E.g. `'($ !== "John")'`
    checks whether `model.name !== 'John'`
  - `$$` `{object}`: current model (input or output),
    E.g. `'($ === $$.first_name)'`
    checks whether `model.name === model.first_name`

The following variable is available only to
[custom validation](validation.md#custom-validation) keyword:
  - `$EXPECTED` `${any}`: value passed as argument to the custom validation
    keyword

# IDL function helpers

Helpers are functions that can be used in any IDL functions,
as any other IDL functions variable.

They are specified under the top-level properties
`helpers`, which can be an array of objects (which are merged) or a single
object. Each object is a map of IDL function helpers, with:
  - the key being the helper's name
  - the value being either the helper's value, of an object with properties:
    - `value` `{function}`
    - `useVars` `{boolean}` (default: `false`): pass other IDL function
      variables as first argument to helper function

They can use the same IDL function variables as the function that calls them.
If the helper is external function, the IDL option `useVars` must be used to
pass the IDL function variables as first argument, and the helpers as second
argument.

Inline functions can also use positional arguments, passed as IDL function
variables `$1`, `$2`, etc.

IDL function helpers can call each other.

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

# IDL function parameters

Clients can specify their own IDL function variables on any specific request,
using the argument `params` with an object value, e.g.:

```graphql
mutation {
  find_user(filter: {id: "1"}, params: { password: "admin" }) {
    id
  }
}
```

Those will be available using the IDL function variable `$PARAMS`.
E.g. the previous example would set `$PARAMS.password` to `"admin"`.
