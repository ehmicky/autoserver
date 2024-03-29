# Functions

Custom logic can be added by using functions in the
[configuration](configuration.md).

The following [configuration properties](configuration.md#properties) can use
functions:

- [`attribute.authorize`](../data_model/authorization.md)
- [`attribute.readonly`](../data_model/authorization.md#readonly-attributes)
- [`attribute.default`](../data_model/default.md)
- [`attribute.value`](../data_model/transformation.md)
- [custom validation keywords](../data_model/validation.md#custom-validation)
- [custom patch operators](../data_model/patch.md#custom-operators)
- [custom log providers](../quality/logging.md#custom-log-provider)

Functions should be pure: no global variable should be used nor side-effects
created. Their parameters are read-only.

# Defining functions

Functions are regular JavaScript files exporting a function and required using a
[reference](references.md).

```js
export default () => Math.random()
```

and in the [configuration](configuration.md):

```yml
collections:
  example_collection:
    attributes:
      example_attribute:
        default:
          $ref: get_default_value.js
```

# Inline functions

You can also directly write JavaScript functions inside the
[configuration](configuration.md).

```yml
collections:
  example_collection:
    attributes:
      example_attribute:
        default: (Math.random())
```

Only the function body should be specified (without the leading `return`
keyword) and it should be wrapped in parenthesis.

# Constants

Everywhere a function can be used, a constant value can also be used instead.

```yml
collections:
  example_collection:
    attributes:
      example_attribute:
        default: 10
```

# Parameters

Every function receives as its first argument an object containing parameters
with information about the current context.

In the example below, the `timestamp` parameter is used.

```js
export default ({ timestamp }) => timestamp
```

Parameters can be also be used when the function is inline.

```yml
collections:
  example_collection:
    attributes:
      example_attribute:
        default: (timestamp)
```

The following parameters are available to any function:

- `requestid` `{string}` - UUID identifying the current request. Also available
  in response's `metadata.requestid` property
- `timestamp` `{string}` - [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601),
  i.e. `YYYY-MM-DDTHH:MM:SS.SSS`
- [`protocol`](../../client/protocols/README.md) `{string}`: possible value is
  only `http`
- `ip` `{string}`: request IP
- `origin` `{string}` - protocol + hostname + port
- `path` `{string}` - only the URL path, with no query string nor hash
- `method` `{string}` - [protocol](../../client/protocols/README.md)-agnostic
  method, e.g. `GET`
- `queryvars` `{object}` - query variables, as an object
- `headers` `{object}` - [protocol headers](../../client/protocols/README.md)
  specific to the engine, for example HTTP headers starting with `X-Autoserver-`
- `format` `{string}` - request payload and server response's
  [format](../../client/protocols/formats.md)
- `charset` `{string}` - request payload's
  [charset](../../client/protocols/formats.md#charsets)
- `compress` `{string}` - response's and request's
  [compression](../../client/arguments/compression.md)
- `payload` `{any}` - request [payload](../../client/protocols/README.md)
- `payloadsize` `{number}` - in bytes
- `payloadcount` `{number}` - array length, if it is an array
- [`rpc`](../../client/rpc/README.md) `{string}`: possible values are `graphql`,
  `graphiql`, `graphqlprint`, `rest` or `jsonrpc`
- `args` `{object}`: client [arguments](../../client/rpc/README.md#rpc) passed
  to the request, e.g. `filter`
- `params` `{object}`: all
  [client-specific parameters](../../client/arguments/params.md)
- `datasize` `{number}` - size of the `data`
  [argument](../../client/rpc/README.md#rpc), in bytes
- `datacount` `{number}` - array length of the `data`
  [argument](../../client/rpc/README.md#rpc), if it is an array
- `summary` `{string}` - summary of the request, e.g. `find_collection{child}`
- `commandpaths` `{string[]}` - array with all `commandpath`
- `collections` `{string[]}` - array with all `collection`
- [`command`](../../client/request/crud.md) `{string}` - among `create`, `find`,
  `upsert`, `patch` and `delete`
- `serverinfo` `{object}`:
  - `host` `{object}`:
    - `id` `{UUID}`: unique to each host machine (using the MAC address)
    - `name` `{string}` - hostname
    - `os` `{string}` - e.g. `Linux`
    - `platform` `{string}` - e.g. `linux`
    - `release` `{string}` - e.g. `4.8.0-52-generic`
    - `arch` `{string}` - e.g. `x64`
    - `memory` `{number}` - total memory in bytes
    - `cpus` `{number}` - number of CPUs
  - `versions` `{object}`
    - `node` `{string}` - Node.js version, e.g. `v8.0.0`
    - `autoserver` `{string}` - `autoserver` version, e.g. `v0.0.1`
  - `process` `{object}`:
    - `id` `{integer}`: PID
    - `name` `{string}`: defaults to system hostname, but can be overriden using
      the configuration property `name`

The following parameters are available to any function except
[custom log providers](../quality/logging.md#custom-log-provider) and
[server-specific parameters](#server-specific-parameters):

- `commandpath` `{string}` - [command](../../client/request/crud.md) full path,
  e.g. `""` (top-level) or `child.grand_child`
- `collection` `{string}`: name of the
  [collection](../data_model/collections.md), e.g. `users`

The following parameters are available to any function except
[custom log providers](../quality/logging.md#custom-log-provider),
[server-specific parameters](#server-specific-parameters) and
[custom patch operators](../data_model/patch.md#custom-operators):

- `value` `{any}`: value of the current attribute. E.g. `value === 'John'`
  checks whether the current value equals `John`
- `model` `{object}`: current model. E.g. `model.first_name === 'John'` checks
  whether the model's `first_name` equals `John`
- `previousvalue` `{any}`: value of the attribute. If the current request is
  modified the current attribute, `previousvalue` is the value before that
  modification, and `value` after that modification.
- `previousmodel` `{object|undefined}`: model. If the current request is
  modified the current model, `previousmodel` is the value before that
  modification, and `model` after that modification. If the current request is
  creating the model (with a `create` or `upsert` action), this will be
  `undefined`.

The following parameters are available only to
[custom log providers](../quality/logging.md#custom-log-provider):

- `log`, `error`, `protocols`, `exit`, `measures`, `measuresmessage`,
  `duration`, `event`, `phase`, `level` and `message` - see
  [logging](../quality/logging.md#functions-parameters)
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

The following parameters are available for more specific cases:

- `arg1`, `arg2`, etc.: see
  [server-specific parameters](#server-specific-parameters)
- `arg`: see [custom validation](../data_model/validation.md#custom-validation)
  and [custom patch operators](../data_model/patch.md#custom-operators)
- `type`: see [custom patch operators](../data_model/patch.md#custom-operators)

# Server-specific parameters

Server-specific parameters can be added using the `params`
[configuration property](configuration.md#properties), which is an object
containing all server-specific parameters.

In the example below, the `$secret_password` server-specific parameters is made
available to any function.

```yml
params:
  $secret_password: admin
```

<!-- eslint-disable id-match -->

```js
export default ({ $secret_password }) => ($secret_password === 'admin' ? 1 : 0)
```

Server-specific parameters can be functions themselves:

- parameters (including other server-specific parameters) will be passed as the
  first argument like any other function. This will only be done if the
  parameter is a function, as as opposed to an object with function members.
- if the function is [inline](#inline-functions), positional arguments are
  passed using the parameters `arg1`, `arg2`, etc.

For example:

```yml
params:
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
