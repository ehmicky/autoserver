# Usage

From the command line:

```bash
apiengine [INSTRUCTION] [OPTIONS]
```

The following instructions are available:
  - [run](run.md) (default): start the server

`OPTIONS` are dot-separated flags specific to each instruction.

```bash
apiengine run --protocols.http.port=5001
```

# Node.js

The server can also be used from Node.js:

<!-- eslint-disable strict, no-undef, unicorn/filename-case -->
```javascript
const apiengine = require('apiengine');

apiengine.run({ protocols: { http: { port: 5001 } } });
```

Here we used the `INSTRUCTION` `run`, but any `INSTRUCTION` can be used.

Options are directly passed as an object argument.

Every instruction returns a promise. If an error occurs, that promise is
rejected with an [exception object](error.md#exceptions).
