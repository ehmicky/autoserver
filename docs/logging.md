# Event logging

Log events are emitted on the `server` (returned value of `startServer()`).
You can use those events for logging and monitoring purpose.

# Console logging

Besides emitting events, logs summary will also be printed on the console.

They will be colorized, unless the environment variable `FORCE_COLOR=0`
or the CLI flag `--no-color` is set, or terminal does not support colors.

Console logging does not contain all the information event logging does, and
is not as structured, so is only meant as a quick debugging tool.

# Event kinds

There are several kinds of events.
The log event name follow the pattern `log.PHASE.TYPE.LEVEL`.
You can use globbing pattern, e.g. `server.on('log.*.*.error')`.

# Event phases

The event phase is the moment in the lifetime of the server, among:
  - `startup`
  - `shutdown`
  - `request`: each client request
  - `process`: anything that is process-related, e.g. unhandled rejected
    promises

# Event types

The event type is the type of information logged, among:
  - `message`: generic message
  - `start`: the server is ready
  - `stop`: the server has exited
  - `failure`: a client-side or server-side error occured
  - `call`: a request has completed, i.e. a response was sent back to the
    client (with success or not)
  - `perf`: performance monitoring

# Event levels

The event level is the importance of the event, among `info`, `log`, `warn`
or `error`,

The logging verbosity can be adjusted using the
[server option](start.md#server-options) `logLevel`, which defaults to
`info`. It only affects the log console output, not the log events that are
emitted.

# Event payload

Events are fired with an object as payload, with properties:
  - `timestamp` `{string}` - [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601),
    i.e. `YYYY-MM-DDTHH:MM:SS.SSS`
  - `phase` `{string}` - `'startup'`, `'shutdown'`, `'request'` or `'process'`
  - `type` `{string}` - `'message'`, `'start'`, `'stop'`, `'failure'`, `'call'`
    or `'perf'`
  - `level` `{string}` - `'info'`, `'log'`, `'warn'` or `'error'`
  - `message` `{string}` - what's printed on [console](#console-logging),
    without the colors
  - `serverInfo` `{object}` - server or
    [host-specific information](#server-information)
  - `errorInfo` `{object}` - [error information](#error-information),
    for events of type `failure`
  - `requestInfo` `{object}` -
    [request-specific information](#request-information), for events of
    phase `request`
  - `exitStatuses` `{object}` - for events of type `stop`, returns which
    server successfully exited or not, as `{ HTTP: boolean, ... }`
  - `measures` `{object}` and `measuresMessage` `string` - for events of type
    `perf`, [performance information](#performance-monitoring)

# Server information

Each event payload comes with a `serverInfo` property, with the properties:
  - `system` `{object}`:
     - `hostname` `{string}`
     - `osType` `{string}` - e.g. `'Linux'`
     - `platform` `{string}` - e.g. `'linux'`
     - `release` `{string}` - e.g. `'4.8.0-52-generic'`
     - `arch` `{string}` - e.g. `'x64'`
  - `stats` `{object}`:
     - `memory` `{number}` - total memory in bytes
     - `cpus` `{number}` - number of CPUs
     - `uptime` `{number}` - how long the server has been running, in secs
  - `node` `{object}`
     - `version` `{string}` - Node.js version, e.g. `'v8.0.0'`
  - `apiEngine` `{object}`
     - `version` `{string}` - `api-engine` versio, e.g. `'0.0.1'`
  - `serverId` `{UUID}` - ID specific to a given process
  - `serverName` `{string}` - ID specific to a given machine.
    Uses (if defined) the [server option](start.md#server-options) `serverName`,
    or otherwise the system hostname, or an empty string if not available.

# Error information

Events of type `failure` have a `errorInfo` property on the event payload,
with the properties (following
  [RFC 7807](https://tools.ietf.org/rfc/rfc7807.txt)):
  - `type` `{string}`: error type
  - `title` `{string}`: short generic description
  - `description` `{string}`: error message
  - `instance` `{string}`: URL that was called, if any
  - `status` `{string}` - protocol-agnostic status, among `'INTERNALS'`,
    `'SUCCESS'`, `'CLIENT_ERROR'` and `'SERVER_ERROR'`, usually one of the
    two last ones.
  - `details` `{string}`: stack trace

# Request information

Events of phase `request` have a `requestInfo` property on the event payload,
with the properties:
  - `requestId` `{UUID}` - unique ID assigned to each request
  - `timestamp` `{string}` - [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601),
    i.e. `YYYY-MM-DDTHH:MM:SS.SSS`
  - `responseTime` `{number}` - time it took to handle the request,
    in milliseconds. Only defined if the request was successful.
  - `ip` `{string}`
  - `protocol` `{string}` - e.g. `'HTTP'`
  - `protocolFullName` `{string}` - e.g. `'HTTP/1.1'`
  - `url` `{string}` - full URL
  - `origin` `{string}` - protocol + host + port
  - `path` `{string}` - only the URL path, with no query string nor hash
  - `route` `{string}` - internal route picked according to the URL,
    among `'GraphQL'`, `'GraphiQL'` and `'GraphQLPrint'`
  - `method` `{string}` - protocol-specific method, e.g. `'GET'`
  - `goal` `{string}` - like `method`, but protocol-agnostic, e.g. `'find'`
  - `protocolStatus` `{string}` - protocol-specific status, e.g. HTTP
    status code
  - `status` `{string}` - protocol-agnostic status, among `'INTERNALS'`,
    `'SUCCESS'`, `'CLIENT_ERROR'` and `'SERVER_ERROR'`
  - `pathVars` `{object}` - URL variables, as a hash table
  - `params` `{object}` - [parameters](jsl.md#jsl-parameters), as a hash table.
  - `settings` `{object}` - [settings](settings.md), as a hash table.
  - `queryVars` `{object}` - query variables, as a hash table
  - `headers` `{object}` - protocol headers (e.g. HTTP headers), as a hash table
  - `payload` `{any}` - request payload
  - `payloadSize` `{number}` - in bytes
  - `payloadCount` `{number}` - array length, if it is an array
  - `operation` `{string}` - operation, among `'GraphQL'`, `'GraphiQL'` and
    `'GraphQLPrint'`
  - `actions` `{object}` - represents all the actions that were fired
     - `ACTION_PATH` `{key}` - action full path, e.g. `'findModel.findSubmodel'`
        - `model` `{string}` - model name
        - `args` `{object}` - action arguments, e.g. filter or sort argument
          - `dataSize` `{number}` - size of `data` argument, in bytes
          - `dataCount` `{number}` - array length of `data` argument,
            if it is an array
        - `responses` `{object[]}`:
           - `content` `{object|object[]}` - action response (model or
             collection)
        - `responsesSize` `{number}` - in bytes
        - `responsesCount` `{number}` - array length, if it is an array
  - `response` `{object}`:
     - `content` `{string}` - full response raw content
     - `type` `{string}` - among `'model'`, `'collection'`, `'error'`,
       `'object'`, `'html'`, `'text'`
  - `responseSize` `{number}` - in bytes
  - `responseCount` `{number}` - array length, if it is an array
  - `error` `{string}` - error type, if there was an error

The `...Size` attributes are not set if the related value is undefined, and set
to `unknown` if the value is not JSON.

Each of those fields is optional, i.e. might not be present under some
circumstances, e.g. if an error happened.

# Request information filtering

To avoid the request information to be too big or leak security information,
one can set filters using the [server option](start.md#server-options)
`logFilter`.

`logFilter` is an object, with each property being a function that takes
parts of the request information and returns it modified. It is also possible
to use an array of strings instead as a shortcut, in order to only keep some
properties.

The possible properties are:
  - `queryVars`
  - `headers`
  - `params`
  - `settings`
  - `payload`
  - `response`: applied to `response.content`
  - `argData`: applied to each `actions.ACTION_PATH.responses.args.data`
  - `actionResponses`: applied to each `actions.ACTION_PATH.responses.content`

By default:
  - `queryVars`, `headers`, `params`, `settings` transform to undefined,
    i.e. this information is not included in logs.
  - `payload`, `argData`, `actionResponses`, `responses` only keep `id`s.

# Performance monitoring

Events of type `perf` are related to how long the server took to perform some
steps. The `startup`, `shutdown` and `request` phases are all monitored.

Each function monitored might be triggered several times for a specific phase.
E.g. the `database query` middleware might be called several times for a single
request. Each call is named a measure.

The event payload contains the following additional properties:
  - `measures` `{object[]}`:
    - `category` `{string}`
    - `label` `{string}`: name
    - `duration` `{number}` - sum of all measures durations, in milliseconds
    - `measures` `{number[]}` - each measure duration, in milliseconds
    - `count` `{number}` - number of measures
    - `average` `{number}` - average measure duration, in milliseconds
  - `measuresMessage` `{string}`: console-friendly table with the same
    information as `measures`
