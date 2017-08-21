# Command line

The server can be used from the command line:

```bash
apiengine [COMMAND] [--options]
```

The default `COMMAND` is `run`.

Use `apiengine --help` for usage instructions.

Use `apiengine completion` if you want to enable command line auto-completion.

# Node.js

The server can also be used from Node.js:

```javascript
const apiEngine = require('api-engine');

apiEngine.run({ option });
```

Here we used the `COMMAND` `run`, but any `COMMAND` can be used.

# Commands

The following commands are available:
  - [run](run.md): start the server

# Options

See this [documentation](configuration.md) to learn about how to specify
options and configuration.
