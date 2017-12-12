# Running the server

The [`run` instruction](server/usage/usage.md) starts the server.

The [configuration file](server/usage/configuration.md#configuration-file) is specified
using the `config` option.

Any other option will be merged as a
[configuration property](server/usage/configuration.md#property).

```bash
apiengine run --config=apiengine.config.yml --protocols.http.port=5001
```

# Node.js

When fired from Node.js, `apiengine.run()` returns a promise, which resolves
with the same value as the
[`protocols` parameter](server/configuration/logging.md#functions-parameters).

If an error occurred, the promise will be rejected with an
[exception object](server/usage/error.md#exceptions).

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
