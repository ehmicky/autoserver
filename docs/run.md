# Running the server

Execute the [`run` instruction](usage.md), e.g. `apiengine.run()`.

This function returns a promise, which resolves with the same value as the
[`protocols` function variable](logging.md#functions-variables).

If an error occurred, the promise will be rejected with an
[exception object](error.md#exceptions-thrown-in-the-server).

<!-- eslint-disable no-unused-vars, no-undef, strict, no-console,
no-restricted-globals, unicorn/catch-error-name, promise/always-return,
promise/prefer-await-to-then -->
```javascript
const apiengine = require('apiengine');

apiengine.run()
  .then(({ protocols }) => {
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
