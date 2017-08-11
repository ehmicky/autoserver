# Starting a server

<!-- eslint-disable no-unused-vars, no-undef, strict -->
```javascript
const apiEngine = require('api-engine');

const server = apiEngine.start();
```

See [here](configuration.md#idl-file) for how to configure the
[IDL file](idl.md)

`server` can emit some [events](#server-events), and contains some useful
[information](#server-information),

# Server options

See [here](configuration.md#server-options) for how to configure the server
options.

The available options are:
  - `env` (defaults to `'production'`): can be `'dev'` or `'production'`.
    Running in `'dev'` mode will add some developer-friendly features, e.g.
    disable request timeouts during breakpoint debugging.
  - `defaultPageSize` (defaults to `100`): use `0` to disable pagination.
  - `maxPageSize` (defaults to `100`): sets an upper limit to
    client-specified `page_size`.
  - `maxDataLength` (defaults to `1000`): sets a limit on
    client-specified `data` length, i.e. how many models can be created,
    replaced or upserted at once.
    Use `0` to disable.
  - `http.host` (defaults to `localhost`)
  - `http.port` (defaults to `80`). Can be `0` for "any available port".
  - `http.enabled` (defaults to `true`): specify `false` to disable HTTP server
  - `serverName`, `logFilter` and `logLevel`: see [logging](logging.md).

# Server events

The returned `server` is an event emitter
(using [EventEmitter2](https://github.com/asyncly/EventEmitter2))
which can e.g. be listened to as:

<!-- eslint-disable no-undef, strict -->
```javascript
server.on('start.success', () => {
  serverHasStarted();
});
```

Globbing can be used, e.g. `server.on('log.*.call.*')`.

Event listeners can be asynchronous by returning a promise.

The following events are available:
  - `start.success`: when server is ready to process
    requests.
  - `start.failure`: on startup error.
    If no listener is setup, an exception will be thrown instead.
  - `stop.success`: when server stops processing requests
  - `stop.failure`: when server exit failed
  - `log.*.*.*`: see [logging](logging.md).

# Server information

Some information is available on the returned `server`:
  - `server.options` `{object}`: options passed during initialization
  - `server.servers.HTTP` `{Server}`: Node.js HTTP server
  - `server.info.serverId` `{string}`: see [here](logging.md#server-identifiers)
  - `server.info.serverName` `{string}`:
    see [here](logging.md#server-identifiers)
  - `server.info.version` `{string}`: api-engine version

Those will only be available after the `start` event is fired.
