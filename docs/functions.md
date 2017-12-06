# Functions

Custom logic can be added by using functions in the [schema](schema.md).

The following schema properties can use functions:
  - [`attribute.authorize`](authorization.md)
  - [`attribute.readonly`](authorization.md#readonly-attributes)
  - [`attribute.default`](default.md)
  - [`attribute.value`](transformation.md)
  - [custom validation keywords](validation.md#custom-validation)
  - [custom patch operators](patch.md#custom-operators)
  - [custom log providers](logging.md#custom-log-provider)

Everywhere a function can be used, a constant value can also be used instead.

Functions should be pure: no global variable should be used nor side-effects
created. Their arguments are read-only.

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

# Variables

Every functions receives as their first argument an object containing variables
with information about the current context.

For example, the `timestamp` variable can be used:

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

The following variables are available to any function:
  - `requestid` `{string}` - UUID identifying the current request.
    Also available in response's `metadata.requestid` property
  - `timestamp` `{string}` - [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601),
    i.e. `YYYY-MM-DDTHH:MM:SS.SSS`
  - [`protocol`](protocols.md) `{string}`: possible value is only `http`
  - `ip` `{string}`: request IP
  - `origin` `{string}` - protocol + hostname + port
  - `path` `{string}` - only the URL path, with no query string nor hash
  - `method` `{string}` - [protocol](protocols.md)-agnostic method,
    e.g. `'GET'`
  - `queryvars` `{object}` - query variables, as an object
  - `headers` `{object}` - [protocol headers](protocols.md#headers-and-method)
    specific to the engine, for example HTTP headers starting with
    `X-Apiengine-`
  - `format` `{string}` - request payload and server response's
    [format](formats.md)
  - `charset` `{string}` - request payload's [charset](formats.md#charsets)
  - `compress` `{string}` - response's and request's
    [compression](compression.md)
  - `payload` `{any}` - request payload
  - `payloadsize` `{number}` - in bytes
  - `payloadcount` `{number}` - array length, if it is an array
  - [`rpc`](rpc.md) `{string}`: possible values are `graphql`,
    `graphiql`, `graphqlprint`, `rest` or `jsonrpc`.
  - `args` `{object}`: client [arguments](rpc.md#rpc) passed to the request,
    e.g. `filter`
  - `params` `{object}`: all [client parameters](#client-parameters)
  - `datasize` `{number}` - size of the `data` [argument](rpc.md#rpc), in bytes
  - `datacount` `{number}` - array length of the `data` [argument](rpc.md#rpc),
    if it is an array
  - `summary` `{string}` - summary of the request, e.g. `collection{child}`
  - `commandpaths` `{string[]}` - array with all `commandpath`
  - `collections` `{string[]}` - array with all `collection`
  - [`command`](terminology.md#command) `{string}` - among `create`, `find`,
    `upsert`, `patch` and `delete`.
  - `serverinfo` `{object}`: with the properties:
    - `host` `{object}`:
       - `id` `{UUID}`: unique to each host machine (using the MAC address)
       - `name` `{string}` - hostname
       - `os` `{string}` - e.g. `'Linux'`
       - `platform` `{string}` - e.g. `'linux'`
       - `release` `{string}` - e.g. `'4.8.0-52-generic'`
       - `arch` `{string}` - e.g. `'x64'`
       - `memory` `{number}` - total memory in bytes
       - `cpus` `{number}` - number of CPUs
    - `versions` `{object}`
       - `node` `{string}` - Node.js version, e.g. `'v8.0.0'`
       - `apiengine` `{string}` - `apiengine` version, e.g. `'v0.0.1'`
    - `process` `{object}`:
       - `id` `{string}`: PID
       - `name` `{string}`: defaults to system hostname, but can be overriden
         using the schema property `name`

The following variables are available to any function except
[custom log providers](logging.md#custom-log-provider) and
[user variables](#user-variables):
  - `commandpath` `{string}` - [command](terminology.md#command) full path,
    e.g. `'collection.child'`
  - `collection` `{string}`: name of the [collection](collections.md),
    e.g. `users`

The following variables are available to any function except
[custom log providers](logging.md#custom-log-provider),
[user variables](#user-variables) and
[custom patch operators](patch.md#custom-operators):
  - `value` `{any}`: value of the current attribute.
    E.g. `value === 'John'` checks whether the current value equals `'John'`
  - `model` `{object}`: current model.
    E.g. `model.first_name === 'John'` checks whether the model's `first_name`
    equals `'John'`
  - `previousvalue` `{any}`: value of the attribute.
    If the current request is modified the current attribute, `previousvalue`
    is the value before that modification, and `value` after that modification.
  - `previousmodel` `{object|undefined}`: model.
    If the current request is modified the current model, `previousmodel` is
    the value before that modification, and `model` after that modification.
    If the current request is creating the model (with a `create` or `upsert`
    action), this will be `undefined`.

The following variables are available only to
[custom log providers](logging.md#custom-log-provider):
  - `log`, `error`, `protocols`, `exitcodes`, `measures`, `measuresmessage`,
    `duration`, `event`, `phase`, `level` and `message` - see
    [logging](logging.md#functions-variables)
  - `status` `{string}` - response's status, among `INTERNALS`, `SUCCESS`,
    `CLIENT_ERROR` and `SERVER_ERROR`
  - `responsedata` `{any}` - response data
  - `responsedatasize` `{number}` - in bytes
  - `responsedatacount` `{number}` - array length, if it is an array
  - `responsetype` `{string}` - among `model`, `models`, `error`, `object`,
    `html`, `text`
  - `metadata` `{object}` - response's metadata
  - `modelscount` `{number}` - number of models returned, including nested ones
  - `uniquecount` `{number}` - same as `modelscount`, excluding duplicates

The following variables are available for more specific cases:
  - `arg1`, `arg2`, etc.: see [user variables](#user-variables)
  - `arg`: see [custom validation](validation.md#custom-validation) and
    [custom patch operators](patch.md#custom-operators)
  - `type`: see [custom patch operators](patch.md#custom-operators)

# User variables

User variables behave like other variables, except they are server-specific.
They are specified using the `variables` schema property, which is an object
containing all user variables.

E.g. if the schema specifies:

```yml
variables:
  $secret_password: admin
```

The user variable `$secret_password` can be used in any function:

<!-- eslint-disable strict, filenames/match-exported, camelcase -->
```js
const getDefaultValue = function ({ $secret_password }) {
  return $secret_password === 'admin' ? 1 : 0;
};

module.exports = getDefaultValue;
```

User variables can be functions themselves:
  - function variables (including other user variables) will be passed as
    the first argument like any other function
  - function variables will be available only for user variables that are
    functions, as opposed to objects with function members.
  - if the function is [inline](#inline-functions), positional arguments are
    passed using the variables `arg1`, `arg2`, etc.

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
[function variables](#variables) on any specific request,
using the [argument](rpc.md#rpc) `params` with an object value, e.g.:

```graphql
query {
  find_users(id: "1", params: { password: "admin" }) {
    id
  }
}
```

Client parameters will be available using the
[function variable](#variables) `params` as an object.

They can also be set using the
[protocol header](protocols.md#headers-and-method) `params`, with a JSON object
as value. For example, with HTTP:

```HTTP
X-Apiengine-Params: {"password": "admin"}
```
