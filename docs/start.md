# Starting a server

<!-- eslint-disable no-unused-vars, no-undef, strict -->
```javascript
const { startServer } = require('api-engine');

const server = startServer({ conf: 'my_schema.yml', ...otherOptions });
```

`conf` is the [IDL file](idl.md), where the API endpoints are defined.

[`otherOptions`](#server-options) are runtime options, e.g. hostname and ports.

`server` contains some useful [information](#server-information),
and can emit some [events](#server-events)

# Server options

The following options are pagination-related:
  - `defaultPageSize`, which defaults itself to `100`.
    Use `0` to disable pagination.
  - `maxPageSize` which sets an upper limit to client-specified `page_size`.
    This defaults to `100`.
  - `maxDataLength` which sets a limit on client-specified `data` length,
    i.e. how many models can be created, replaced or upserted at once.
    This defaults to `1000`. Use `0` to disable.

The following options are HTTP-related:
  - `http.host`: defaults to `localhost`
  - `http.port`: defaults to `80`. Can be `0` for "any available port".
  - `http.enabled`: specify `false` to disable HTTP server (defaults to `true`)

For `serverName`, `loggerFilter` and `loggerLevel`, see [logging](logging.md).

# Server events

The returned `server` is an event emitter
(using [EventEmitter2](https://github.com/asyncly/EventEmitter2))
which can e.g. be listened to as:

<!-- eslint-disable no-undef, strict -->
```javascript
server.on('start', () => {
  serverHasStarted();
});
```

Globbing can be used, e.g. `server.on('log.*.call.*')`.

Event listeners can be asynchronous by returning a promise.

The following events are available:
  - `server.on('start', () => {})`: when server is ready to process requests.
  - `server.on('error', () => {})`: on startup error.
    If no listener is setup, an exception will be thrown instead.
  - `server.on('stop.success', () => {})`: when server stops processing requests
  - `server.on('stop.fail', () => {})`: when server exit failed

For the log events, see [logging](logging.md).

# Server information

Some information is available on the returned `server`:
  - `server.options` `{object}`: options passed during initialization
  - `server.servers.HTTP` {Server}: Node.js HTTP server
  - `server.info.serverId` {string}: UUID unique to each server run
  - `server.info.serverName` {string}: same as `serverName` option
  - `server.info.version` {string}: api-engine version

`options` and `servers` will only be available after the `start` event is fired.
