# Runtime options

Runtime options are runtime parameters, e.g. server ports.

The available runtime options are:
  - `env` (defaults to `'production'`): can be `'dev'` or `'production'`.
    Running in `'dev'` mode will add some developer-friendly features, e.g.
    disable request timeouts during breakpoint debugging.
  - `defaultPageSize` (defaults to `100`): use `0` to disable pagination.
  - `maxPageSize` (defaults to `100`): sets an upper limit to
    client-specified `page_size`.
  - `maxDataLength` (defaults to `1000`): sets a limit on
    client-specified `data` length, i.e. how many models can be created,
    replaced or upserted at once.
    Use `0` to disable.
  - `http.host` (defaults to `localhost`)
  - `http.port` (defaults to `80`). Can be `0` for "any available port".
  - `http.enabled` (defaults to `true`): specify `false` to disable HTTP server
  - `events`, `eventFilter`, `eventLevel` and `serverName`:
    see [events](events.md).

# Configuration

There are several ways to define runtime options, similar to the
[IDL file](idl.md#configuration).
The first one that is defined will be chosen, from the highest priority to
the lowest:
  - setting an environment variable `API_ENGINE__RUNTIME` containing the path to
    the [configuration file](#configuration-file)
  - using `apiEngine.start({ runtime: object|'path' })` with either an `object`
    containing the runtime options, or a `'path'` to the
    [configuration file](#configuration-file)
  - creating a `api_engine.runtime.yml`, `api_engine.runtime.yaml` or
    `api_engine.runtime.json` file in the current directory, or any parent
    directory. This is the preferred method.

# Configuration file

The format depends on the file extension, and can be either JSON or YAML
(but only with JSON-compatible types).

If a relative file path is used to target the configuration file, it will be
relative to the current directory.

# Environment variables

Environment variables prefixed with `API_ENGINE__` can be specified to override
specific runtime options.

The following environment variables can also be used:
  - `NODE_ENV`: for `env`
  - `HOST`: for `http.host`
  - `PORT`: for `http.port`

E.g. the following environment variables:
```toml
NODE_ENV="dev"
API_ENGINE__MAX_PAGE_SIZE=200
API_ENGINE__HTTP__HOST="myhost"
API_ENGINE__EVENT_FILTER__PAYLOAD__0="id"
API_ENGINE__EVENT_FILTER__PAYLOAD__1="old_id"
```

will be converted to the following runtime options, which will override
(but not fully replace) the current runtime options:

```json
{
  "env": "dev",
  "maxPageSize": 200,
  "http": { "host": "myhost" },
  "eventFilter": { "payload": ["id", "old_id"] },
}
```

Note:
  - the names are converted to camelCase
  - `__` is used to nest objects and arrays
