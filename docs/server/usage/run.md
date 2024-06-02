# Running the server

The [`run` instruction](README.md) starts the server.

The [configuration file](../configuration/configuration.md#configuration-file)
is specified using the `config` option.

Any other option will be merged as a
[configuration property](../configuration/configuration.md#properties).

```shell
$ autoserver run --config=autoserver.config.yml --protocols.http.port=5001
```

# Node.js

When fired from Node.js, `autoserver.run()` returns a promise, which resolves
with:

- the [`protocols` parameter](../quality/logging.md#functions-parameters)
- the [`serverinfo` parameter](../configuration/functions.md#parameters)

If an error occurred, the promise will be rejected with an
[exception object](error.md#exceptions).

```js
import { run } from 'autoserver'

try {
  const { protocols, serverinfo } = await run()
  console.log('Servers started at:', protocols)
  console.log('Process id', serverinfo.process.id)
} catch (error) {
  console.log('Could not start servers:', error)
}
```

# Stopping the server

To stop the server, you can:

- using the `PID`, fire `process.kill(pid)` from Node.js
- using the `PID`, fire `kill $pid` from the console
- type `CTRL-C` if the server is running in the console foreground. Type this
  only once, not twice, or the server will not properly shut down.

The `PID` (process ID) is available:

- using the [`serverinfo.process.id`](../configuration/functions.md#parameters)
  parameter. This parameter is also available in the resolved value of the
  promise returned by [`autoserver.run()`](#nodejs).
- printed on the console by the
  [`console log provider`](../quality/logging.md#console-log-provider)
