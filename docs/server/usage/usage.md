# Usage

From the command line:

```bash
apiengine [INSTRUCTION] [OPTIONS]
```

The following instructions are available:
  - [run](server/usage/run.md) (default): start the server

`OPTIONS` are dot-separated flags specific to each instruction.

```bash
apiengine run --protocols.http.port=5001
```

# Node.js

The server can also be used from Node.js:

<!-- eslint-disable strict, no-undef -->
```javascript
const apiengine = require('apiengine');

apiengine.run({ protocols: { http: { port: 5001 } } });
```

Here we used the `INSTRUCTION` `run`, but any `INSTRUCTION` can be used.

Options are directly passed as an object argument.

Every instruction throws a [standard exception](server/usage/error.md#exceptions) if
it fails.