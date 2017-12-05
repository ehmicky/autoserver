# Running the server

Execute the [`run` instruction](usage.md), e.g. `apiengine.run()`.

This function returns a promise, which resolves with the same value as the
[`start` event payload](events.md#start-information).

If an error occurred, the promise will be rejected with an
[exception object](error.md#exceptions-thrown-in-the-server).

The [`start` event payload](events.md#start-information) contains an `exit`
function which performs a clean server shutdown.

A complete example:

<!-- eslint-disable no-unused-vars, no-undef, strict, no-console,
no-restricted-globals, unicorn/catch-error-name, promise/always-return,
promise/prefer-await-to-then -->
```javascript
const apiengine = require('apiengine');

apiengine.run()
  .then(({ protocols, exit }) => {
    console.log('Servers started at:', protocols);
  })
  .catch(({ error }) => {
    console.log('Could not start servers:', error);
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
  - `maxpayload`, `pagesize`, `maxmodels`: see [limits](limits.md#options)
  - `protocols` `{object}`: [protocols options](protocols.md)
  - `db` `{object}`: [databases options](databases.md)
