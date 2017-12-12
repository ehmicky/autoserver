# Running the server

The [`run` instruction](usage.md) starts the server.

The [configuration file](configuration.md#configuration-file) is specified
using the `config` option.

Any other option will be merged as a
[configuration property](configuration.md#property).

```bash
apiengine run --config=apiengine.config.yml --protocols.http.port=5001
```

# Node.js

When fired from Node.js, `apiengine.run()` returns a promise, which resolves
with the same value as the
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
