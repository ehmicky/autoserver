# Starting the server

First, create an [IDL file](idl.md), which is the
main configuration file describing the data model and the business model.

[Runtime options](runtime.md) can also be specified.

Then simply run `apiEngine.start()`.

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

apiEngine.start()
  .then(({ runtimeOpts, servers }) => {
    console.log('Success');
  })
  .catch(({ errorInfo }) => {
    console.log('Failure');
  });
```
