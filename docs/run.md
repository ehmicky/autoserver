# Running the server

Execute the [`run` command](usage.md), e.g. `apiEngine.run()`.

This function returns a promise, which resolves with the same value as the
[`start` event payload](events.md#start-information).
If the server fails to start, it will instead be rejected with the same value
as the [`failure` event payload](events.md#error-information).

A complete example:

<!-- eslint-disable no-unused-vars, no-undef, strict, no-console,
no-restricted-globals, unicorn/catch-error-name, promise/always-return,
promise/prefer-await-to-then -->
```javascript
const apiEngine = require('api-engine');

apiEngine.run()
  .then(({ runtimeOpts, servers }) => {
    console.log('Success');
  })
  .catch(({ errorInfo }) => {
    console.log('Failure');
  });
```

# Options

The available options are:
  - `idl` [`{filepath}`](configuration.md#filepaths-options) (required):
    [IDL file](idl.md), i.e. information about the data model and
    the business logic.
  - `env` (defaults to `'production'`): can be `'dev'` or `'production'`.
    Running in `'dev'` mode will add some developer-friendly features, e.g.
    disable request timeouts during breakpoint debugging.
  - `defaultPageSize` `{integer}` (defaults to `100`):
    use `0` to disable pagination.
  - `maxPageSize` `{integer}` (defaults to `100`): sets an upper limit to
    client-specified `page_size`.
  - `maxDataLength` `{integer}` (defaults to `1000`): sets a limit on
    client-specified `data` length, i.e. how many models can be created,
    replaced or upserted at once.
    Use `0` to disable.
  - `http.host` `{string}` (defaults to `localhost`)
  - `http.port` `{integer}` (defaults to `80`).
     Can be `0` for "any available port".
  - `http.enabled` `{boolean}` (defaults to `true`):
    specify `false` to disable HTTP server
  - `events`, `eventFilter`, `eventLevel` and `serverName`:
    see [events](events.md).
