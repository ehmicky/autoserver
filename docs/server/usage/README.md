# Usage

From the command line:

```bash
autoserver [INSTRUCTION] [OPTIONS]
```

The following instructions are available:
  - [run](run.md) (default): start the server

`OPTIONS` are dot-separated flags specific to each instruction.

```bash
autoserver run --protocols.http.port=5001
```

# Node.js

The server can also be used from Node.js:

<!-- eslint-disable strict, no-undef, unicorn/filename-case,
node/no-extraneous-require, import/no-extraneous-dependencies -->
```javascript
const autoserver = require('autoserver');

autoserver.run({ protocols: { http: { port: 5001 } } });
```

Here we used the `INSTRUCTION` `run`, but any `INSTRUCTION` can be used.

Options are directly passed as an object argument.

Every instruction returns a promise. If an error occurs, that promise is
rejected with an [exception object](error.md#exceptions).
