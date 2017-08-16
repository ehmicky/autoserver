# JSL

JSL is a shortcut notation we use to add any custom logic.

JSL can be used in many parts of the [IDL file](idl.md):
  - on attributes' [transforms](transformation.md#transformations)
  - on attributes' [default values](transformation.md#default-values)
  - on [custom validation keywords](validation.md#custom-validation)

JSL can take two forms: [inline](#inline-jsl) or [external](#external-jsl).

# Inline JSL

It basically is inline JavaScript with few differences:
  - the function should be pure, i.e.:
    - global state should not be accessed, e.g. `window` or `global`
    - should not create side-effects, which includes variable declarations and
      assignments
  - some variables are available for ease of use

To differentiate it from regular strings, inline JSL must be wrapped in
parenthesis.
The first parenthesis can be escaped if we actually want a regular string
wrapped in parenthesis. E.g.:
  - this is not inline JSL: `1 + 1`
  - this is inline JSL: `(1 + 1)`
  - this is not inline JSL: `\(1 + 1)`

Constants can be always be used instead of inline JSL.

# External JSL

One can use regular JavaScript files instead of inlining it. Files can be
required using
[JSON references](https://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03),
e.g.:

```yml
default:
  $ref: src/my_jsl_function.js
```

External JSL can only be used inside the [IDL file](idl.md).

# JSL variables

The following variables are available:
  - `$PROTOCOL` `{string}`: possible values are only `http`
  - `$NOW` `{string}`: current date and time
  - `$IP` `{string}`: request IP
  - `$REQUEST_ID` `{string}`: UUID identifying the current request
  - `$PARAMS` `{object}`: all [parameters](#jsl-parameters)
  - `$SETTINGS` `{object}`: all [settings](settings.md)
  - `$OPERATION` `{string}`: possible values are `graphql`, `graphiql`,
    `graphqlprint`
  - `$MODEL` `{string}`: name of the [model](models.md), e.g. `user`
  - `$ARGS` `{object}`: arguments passed by client to the specific action
  - `$COMMAND` `{string}`: current command, among `create`, `read`, `update` or
    `delete`
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

# JSL helpers

Helpers are functions that can be used in any JSL, as any other JSL variable.

They are specified under the top-level properties
`helpers`, which can be an array of objects (which are merged) or a single
object. Each object is a map of JSL helpers, with:
  - the key being the helper's name
  - the value being either the helper's value, of an object with properties:
    - `value` `{jsl}`
    - `useParams` `{boolean}` (default: `false`): pass other JSL variables
      as first argument to helper function

They can use the same JSL variables as the function that calls them.
If the helper is external JSL, the IDL option `useParams` must be used to
pass the JSL variables as first argument.

Inline JSL can also use positional arguments, passed as JSL variables
`$1`, `$2`, etc.

JSL helpers can call each other.

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
      useParams: true
  - $ref: lodash
  - $ref: constants.json
```

# JSL parameters

Clients can specify their own JSL variables on any specific request,
called "JSL parameters", and available under `$PARAMS`.

There are two ways to specify them, e.g. the parameter `myparam` could
be specified:
  - in HTTP headers, e.g. `X-Api-Engine-Param-Myparam: value`
  - in the URL query string, e.g. `?params.myparam=value` or
    `?params.myparam` (the later uses default value `true`).
    Query strings values can be:
      - objects, using `?params.myparam[name]=value` or
        `?params.myparam.name=value`
      - arrays, using `?params.myparam[index]=value` or
        `?params.myparam[]=value`
