# Running the server

Execute the [`run` instruction](usage.md), e.g. `apiEngine.run()`.

This function returns a promise, which resolves with the same value as the
[`start` event payload](events.md#start-information).

The [`start` event payload](events.md#start-information) contains an `exit`
function which performs a clean server shutdown.

A complete example:

<!-- eslint-disable no-unused-vars, no-undef, strict, no-console,
no-restricted-globals, unicorn/catch-error-name, promise/always-return,
promise/prefer-await-to-then -->
```javascript
const apiEngine = require('api-engine');

apiEngine.run()
  .then(({ options, servers, exit }) => {
    console.log('Success');
  })
  .catch(({ errorInfo }) => {
    console.log('Failure');
  });
```

# Options

The available options are:
  - `schema` [`{filepath}`](configuration.md#filepaths-options) (required):
    [schema](schema.md), i.e. information about the data model and
    the business logic.
  - `env` (defaults to `'dev'`): can be `'dev'` or `'production'`.
    Running in `'dev'` mode will add some developer-friendly features, e.g.
    disable request timeouts during breakpoint debugging.
  - `maxPayloadSize`, `defaultPageSize`, `maxPageSize`, `maxDataLength`:
    see [limits](limits.md#options)
  - `events`, `eventFilter`, `eventLevel` and `serverName`:
    see [events](events.md).
  - `protocols` `{object}`: [protocols options](protocols.md)
  - `db` `{object}`: [databases options](databases.md)
