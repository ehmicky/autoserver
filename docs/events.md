# Types

Events are fired under the following circumstances, called "types":
  - `start`: the server is ready
  - `stop`: the server has exited
  - `failure`: a client-side or server-side error occured
  - `call`: a request has completed, i.e. a response was sent back to the
    client (whether successful or not)
  - `message`: generic message
  - `perf`: [performance monitoring](performance.md)
  - `any`: any of the above

# Event handlers

Events handlers are configured using the [`run` option](run.md#options)
`events`, which is an object, where the key is an [event type](#types)
and the value the [path](configuration.md#filepaths-options) to a
JavaScript file. This file must export a function,
which will be triggered with the [event payload](#payload), e.g.:

```yml
events:
  start: start_event.js
```

where `start_event.js` contains:

<!-- eslint-disable no-console, no-restricted-globals, no-unused-vars,
filenames/match-exported, strict -->
```js
const startEvent = function (payload) {
  console.log('Server started');
};

module.exports = startEvent;
```

See [here](configuration.md) to learn how to specify the `run` option.

By default, files named `apiengine.run.event.TYPE.js`
(e.g. `apiengine.run.event.start.js`) will be searched in the current
directory, or any parent. This is the preferred configuration method.

# Logging

Event payloads can be serialized to JSON, i.e. events can be used for logging
or monitoring purpose.

If an event handler throws an exception, or returns a rejected promise,
it will be retried several times, with an exponential delay.

# Console

Events are also printed on the console.

They are be colorized, if the terminal supports it.

The console does not contain all the information the event payload does, and
is not as structured, so is only meant as a quick debugging tool.

# Phases

The event phase is the moment in the lifetime of the server, among:
  - `startup`
  - `shutdown`
  - `request`: each client request
  - `process`: anything that is process-related, e.g. unhandled rejected
    promises

# Levels

The event level is the importance of the event, among `info`, `log`, `warn`
or `error`,

The events verbosity can be adjusted using the
[`run` option](run.md#options) `eventLevel`
(defaults to `'info'`), which can also be `'silent'`.

# Payload

[Events handlers](#event-handlers) are fired with an object as payload,
with properties:
  - `timestamp` `{string}` - [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601),
    i.e. `YYYY-MM-DDTHH:MM:SS.SSS`
  - [`phase`](#phases) `{string}` - `'startup'`, `'shutdown'`, `'request'`
    or `'process'`
  - [`type`](#types) `{string}` - `'message'`, `'start'`, `'stop'`,
    `'failure'`, `'call'` or `'perf'`
  - [`level`](#levels) `{string}` - `'info'`, `'log'`, `'warn'` or `'error'`
  - `message` `{string}` - what's printed on [console](#console)
  - `serverinfo` `{object}` - server or
    [host-specific information](#server-information)
  - `options` `{object}` and `servers` `{object}` - for events of type
    `start`, see [below](#start-information)
  - `exitcodes` `{object}` - for events of type `stop`, contains which
    server successfully exited or not, as `{ http: boolean, ... }`
  - `errorinfo` `{object}` - [error information](#error-information),
    for events of type `failure`
  - `requestinfo` `{object}` -
    [request-specific information](#request-information), for events during the
    `request` phase
  - `measures` `{object}` and `measuresmessage` `string` - for events of type
    `perf`, [performance information](performance.md)

# Server information

Each event payload comes with a `serverinfo` property, with the properties:
  - `system` `{object}`:
     - `hostname` `{string}`
     - `os` `{string}` - e.g. `'Linux'`
     - `platform` `{string}` - e.g. `'linux'`
     - `release` `{string}` - e.g. `'4.8.0-52-generic'`
     - `arch` `{string}` - e.g. `'x64'`
  - `stats` `{object}`:
     - `memory` `{number}` - total memory in bytes
     - `cpus` `{number}` - number of CPUs
     - `uptime` `{number}` - how long the server has been running, in secs
  - `node` `{object}`
     - `version` `{string}` - Node.js version, e.g. `'v8.0.0'`
  - `apiengine` `{object}`
     - `version` `{string}` - `apiengine` version, e.g. `'0.0.1'`
  - `serverid` `{UUID}` and `servername` `{string}`: see
    [below](#server-identifiers)

# Server identifiers

A `serverid` UUID, unique to each server run, is automatically created and
available:
  - in [`serverinfo.serverid`](#server-information) payload property
  - as a response header named `X-Apiengine-Serverid`

`servername` is the system hostname, but can be overriden using the
[`run` option](run.md#options) `servername`. It is available:
  - in [`serverinfo.servername`](#server-information) payload property
  - as a response header named `X-Apiengine-Servername`
  - in [console messages](#console)

# Start information

Events of type `start` have two additional properties on the event payload:
  - `options` `{object}`: [`run` options](run.md#options)
    used by the server, after adding the default values.
  - `servers` `{object}`: list of running servers
    - `http` `{object}`: HTTP server information
      - `protocol` `{string}`: always `'http'`
      - `hostname` `{string}`
      - `port` `{string}`
  - `exit` `{function}`: performs a clean server shutdown

The full `start` event payload is also available as the resolved value of
the promise returned by [`apiServer.start()`](run.md#running-the-server).

# Error information

Events of type `failure` have an `errorinfo` property on the event payload,
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

The full `failure` event payload is also available as the rejected value of
the promise returned by [`apiServer.start()`](run.md#running-the-server).

# Request information

Events during the `request` phase have a `requestinfo` property on the
event payload, with the properties:
  - `requestid` `{UUID}` - unique ID assigned to each request.
    Also available as `X-Apiengine-Requestid` response header.
  - `timestamp` `{string}` - [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601),
    i.e. `YYYY-MM-DDTHH:MM:SS.SSS`
  - `responsetime` `{number}` - time it took to handle the request,
    in milliseconds. Only defined if the request was successful.
  - `ip` `{string}`
  - `protocol` `{string}` - e.g. `'http'`
  - `url` `{string}` - full URL
  - `origin` `{string}` - protocol + hostname + port
  - `path` `{string}` - only the URL path, with no query string nor hash
  - `method` `{string}` - protocol-agnostic method, e.g. `'find'`
  - `protocolstatus` `{string}` - protocol-specific status, e.g. HTTP
    status code
  - `status` `{string}` - protocol-agnostic status, among `'INTERNALS'`,
    `'SUCCESS'`, `'CLIENT_ERROR'` and `'SERVER_ERROR'`
  - `pathvars` `{object}` - URL variables, as a hash table
  - `queryvars` `{object}` - query variables, as a hash table
  - `requestheaders` `{object}` - protocol request headers (e.g. HTTP headers),
     as a hash table
  - `responseheaders` `{object}` - protocol request headers (e.g. HTTP
     headers), as a hash table
  - `payload` `{any}` - request payload
  - `payloadSize` `{number}` - in bytes
  - `payloadCount` `{number}` - array length, if it is an array
  - `operation` `{string}` - operation, among `'graphql'`, `'graphiql'` and
    `'graphqlprint'`
  - `summary` `${string}` - summary of the operation, e.g.
    'findModel{findChildModel}'
  - `args` `${object}` - [arguments](terminology.md#args)
  - `args.datasize` `{number}` - size of `data` argument, in bytes
  - `args.datacount` `{number}` - array length of `data` argument,
    if it is an array
  - `commandpath` `{string}` - [command](terminology.md#command) full path,
    e.g. `'findModel.findSubmodel'`
  - `command` `${string}` - current [command](terminology.md#command),
    among `'create'`, `'find'`, `'upsert'`, `'patch'` and `'delete'`.
  - `model` `${string}` - current [model](terminology.md#model) name
  - `responsetype` `{string}` - among `'model'`, `'collection'`, `'error'`,
    `'object'`, `'html'`, `'text'`
  - `responsedata` `{any}` - response data
  - `responsedatasize` `{number}` - in bytes
  - `responsedatacount` `{number}` - array length, if it is an array
  - `modelscount` `{number}` - number of models returned, including nested ones
  - `uniquecount` `{number}` - same as `modelscount`, excluding duplicates
  - `error` `{string}` - error type, if there was an error

The properties `commandpath`, `command` and `model` are only
set if the request failed while performing a command.

The `...Size` properties are not set if the related value is undefined, and set
to `unknown` if the value is not JSON.

Each of those fields is optional, i.e. might not be present under some
circumstances, e.g. if an error happened.

# Request information filtering

To avoid the request information to be too big or leak security information,
one can set filters using the [`run` option](run.md#options) `filter`.

`filter` is an object, with each property specifying how filter part of
the request information, among:
  - `true`: keep it
  - `false`: remove it
  - array of strings: only keep those properties

The possible properties are:
  - `query`: applied to URL query variables
  - `headers`: applied to both `requestheaders` and `responseheaders`
  - `payload`
  - `response`: applied to `responsedata`
  - `data`: applied to each `args.data`

Default values:
  - `query`, `headers`: `false`,
    i.e. this information is not included in event payloads.
  - `payload`, `data`, `response`: only keep `id`.
  - when using GraphQL and specifying an `operationName`, this will also
    be included in either `query` or `payload`

# Performance monitoring

See [here](performance.md#performance-monitoring).
