# Logging

The logger is configured under the schema property `log`, e.g.:

```yml
log:
  provider: http
  opts:
    url: http://logging-provider.org/
  level: warn
```

`provider` is the way you wish to send logs. See
[below](#providers) for the available types.

`opts` are the options passed to the logging provider. It is specific to each
provider.

`level` is the logger's verbosity, i.e. which events to log according
to their level (i.e. importance). It can be `silent`, `info`, `log`, `warn` or
`error`. It defaults to `info`.

If you desire using several loggers, the schema property `log` can be an array
of objects instead of a single object.

# Providers

The following providers are available:
  - `custom`: [see below](#custom-logging)

# Custom logging

When using the [provider](#providers) `custom`, logs will be sent by firing
a [function](functions.md) specified with the provider's option `opts.report`.

It is a regular [schema function](functions.md) and receives the
[regular schema variables](functions.md#schema-functions-variables) and some
additional ones.

The main [variable](functions.md#schema-functions-variables) is `log`. It is an
object ready to be serialized that contains all the other
[schema variables](functions.md#schema-functions-variables). Variables that
might be too big, such as `payload`, `responsedata`, `data` and `queryvars`,
are trimmed: only their `id` and `operationName` are kept.

# Types

Events are fired under the following circumstances, called "types":
  - `start`: the server is ready
  - `stop`: the server has exited
  - `failure`: a server-side error occured
  - `call`: a request has completed, i.e. a response was sent back to the
    client (whether successful or not)
  - `message`: generic message
  - `perf`: [performance monitoring](performance.md)
  - `any`: any of the above

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

# Payload

[Events handlers](#event-handlers) are fired with an object as payload,
with properties:
  - [`phase`](#phases) `{string}` - `'startup'`, `'shutdown'`, `'request'`
    or `'process'`
  - [`type`](#types) `{string}` - `'message'`, `'start'`, `'stop'`,
    `'failure'`, `'call'` or `'perf'`
  - [`level`](#levels) `{string}` - `'info'`, `'log'`, `'warn'` or `'error'`
  - `message` `{string}` - generic message information
  - `error` `{object}` -
    [exception object](error.md#exceptions-thrown-in-the-server). Only for
    events of type `failure` or `request` if a client-side or server-side error
    occurred.
  - `protocols` `{object}` - for events of type `start`, see
    [below](#start-information)
  - `exitcodes` `{object}` - for events of type `stop`, contains which
    server successfully exited or not, as `{ http: boolean, ... }`
  - `measures` `{object}` and `measuresmessage` `string` - for events of type
    `perf`, [performance information](performance.md)

# Start information

Events of type `start` have two additional properties on the event payload:
  - `protocols` `{object}`: list of protocols being served
    - `http` `{object}`: HTTP server information
      - `hostname` `{string}`
      - `port` `{string}`
  - `exit` `{function}`: performs a clean server shutdown

The full `start` event payload is also available as the resolved value of
the promise returned by [`apiServer.start()`](run.md#running-the-server).

# Performance monitoring

[Events](events.md#types) of type `perf` are related to how
long the server took to perform some steps.
The `startup`, `shutdown` and `request` phases are all monitored.

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
  - `measuresmessage` `{string}`: console-friendly table with the same
    information as `measures`

Additionally, a `metadata.duration` property is sent in the response.
