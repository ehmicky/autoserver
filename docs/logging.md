# Logging

Logging is configured under the `log` [schema property](schema.md).

```yml
log:
  provider: http
  opts:
    url: http://logging-provider.org/
  level: warn
```

# Verbosity

`level` is the logging verbosity, controlling which events will be logged
according to their level, i.e. importance.

It can be `silent`, `info`, `log`, `warn` or `error`.
The default value is `log`.

# Providers

`provider` specifies how to send logs.

The following providers are available: [`http`](#http-log-provider),
[`debug`](#debug-log-provider), [`console`](#console-log-provider) and
[`custom`](#custom-log-provider).

`opts` are the options passed to the log provider. It is specific to each
provider.

If you want to use several log providers or use several configurations,
the `log` [schema property](schema.md) can be an array of objects instead of a
single object.

## HTTP log provider

The `http` [log provider](#providers) sends logs via HTTP.

Provider options:
  - `url` `{string}` - URL to send the logs to
  - `method` `{string}` (default: `POST`) - HTTP method

## Console log provider

The `console` [log provider](#providers) prints logs on the console.

The output is prettified but does not contain performance monitoring nor
detailed log information, so this is only meant as a development helper.

This log provider is always enabled, but can be silenced by using `level`
`silent`.

## Debug log provider

The `debug` [log provider](#providers) prints logs and performance information
on the console. Since the output is not formatted, this is only meant for
debugging purpose.

## Custom log provider

When using the `custom` [log provider](#providers), logs will be passed as
parameters to a custom [function](functions.md).

`report` is a [function](functions.md):
  - it receives the [regular functions variables](functions.md#variables)
    including [`log`, `measures` and `measuresmessage`](#functions-variables).
  - it can be async or return a promise
  - it can be used to simply handle [events](#events) instead of logging them

Provider options:
  - `report` `{function}` - function fired with the log information

# Events

Logs are triggered on the following events:
  - `start`: the server is ready
  - `stop`: the server has exited
  - `failure`: a server-side error occurred
  - `call`: a request has completed, i.e. a response was sent back to the
    client (whether successful or not)
  - `message`: generic message
  - `perf`: [performance monitoring](#performance-monitoring)

Those events can be triggered during the following phases of the server:
  - `startup`
  - `shutdown`
  - `request`: each client request
  - `process`: anywhere else, e.g. unhandled exceptions or rejected promises

# Log information

The payload of logs is a set of all the currently available
[functions variables](functions.md#variables), which
gives insight about everything in the current context.

Values that might be too big, such as `payload`, `responsedata`, `data` and
`queryvars`, are trimmed: only their `id` and `operationName` are kept.

# Functions variables

Besides the
[regular functions variables](functions.md#variables), the
following additional variables are available during logging:
  - `log` `{object}`: object containing all the other
    [functions variables](functions.md#variables).
    Values that might be too big are trimmed. It can be safely serialized.
  - [`event`](#events) `{string}`: which event was triggered among `start`,
    `stop`, `failure`, `call`, `message` and `perf`
  - [`phase`](#events) `{string}`: when was the event triggered among `startup`,
    `shutdown`, `request` and `process`
  - [`level`](#verbosity) `{string}`: event importance among `info`, `log`,
    `warn` and `error`
  - `message` `{string}`: generic message summarizing the event or providing
    extra information
  - `protocols` `{object}` - list of protocols being served. Only for `start`
    events. Also available as the resolved value of the promise returned by
    [`apiServer.start()`](run.md#running-the-server).
    - `http` `{object}`: HTTP server information
      - `hostname` `{string}`
      - `port` `{string}`
  - `exitcodes` `{object}` - list of servers successfully exited or not, as
    `{ http: boolean, ... }`. Only for `stop` events.
  - `error` `{object}`:
    [exception object](error.md#exceptions-thrown-in-the-server). Only for
    events `failure` or `request` when a client-side or server-side error
    occurs.
  - `measures` `{object[]}` - list of performance measurements. Only for
    [`perf` events](#performance-monitoring):
    - `category` `{string}`
    - `label` `{string}`: name
    - `duration` `{number}` - sum of all measures durations, in milliseconds
    - `measures` `{number[]}` - each measure duration, in milliseconds
    - `count` `{number}` - number of measures
    - `average` `{number}` - average measure duration, in milliseconds
  - `measuresmessage` `{string}`: console-friendly table with the same
    information as `measures`
  - `duration` `{number}` - time it took for the server to startup, shutdown
    or handle the client request (depending on the event), in milliseconds.
    Also available in response's `metadata.duration` property.
    Only for
    [`perf`, `start`, `stop` and `call` events](#performance-monitoring).

# Performance monitoring

Logs for the `perf` event are triggered with information about how long it
took for the server to `startup`, `shutdown` or handle a client `request`.

The `measures`, `measuresmessage` and `duration`
[function variables](#functions-variables) provide the performance information.
