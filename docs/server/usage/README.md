# Installation

```shell
$ npm install autoserver
```

# Usage

From the command line:

```shell
$ autoserver [INSTRUCTION] [OPTIONS]
```

The following instructions are available:

- [run](run.md) (default): start the server

`OPTIONS` are dot-separated flags specific to each instruction.

```shell
$ autoserver run --protocols.http.port=5001
```

# Node.js

The server can also be used from Node.js:

```js
import { run } from 'autoserver'

run({ protocols: { http: { port: 5001 } } })
```

Here we used the `INSTRUCTION` `run`, but any `INSTRUCTION` can be used.

Options are directly passed as an object argument.

Every instruction returns a promise. If an error occurs, that promise is
rejected with an [exception object](error.md#exceptions).
