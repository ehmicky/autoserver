# Configuration

They are two main configuration files: the [IDL file](#idl-file) and the
[server options](#server-options).

# IDL file

The [IDL file](#idl.md) is where you define your data model and business logic.

There are several ways to define the IDL file. The first one that is defined
will be chosen, from the highest priority to the lowest:
  - setting an environment variable `API_ENGINE__IDL` containing the path to
    the [configuration file](#configuration-file)
  - using `apiEngine.startServer({ idl: 'path' })` with a `'path'` to
    the [configuration file](#configuration-file)
  - creating a `.api_engine.idl.yml`, `.api_engine.idl.yaml` or
    `.api_engine.idl.json` file in the current directory, or any parent
    directory. This is the preferred method.

# Server options

Server options are runtime parameters, e.g. server ports.

There are several ways to define server options. The first one that is defined
will be chosen, from the highest priority to the lowest:
  - using `apiEngine.startServer({ opts: object })` with `object` being the
    server options
  - setting an environment variable `API_ENGINE__OPTS` containing the path to
    the [configuration file](#configuration-file)
  - using `apiEngine.startServer({ opts: 'path' })` with a `'path'` to
    the [configuration file](#configuration-file)
  - creating a `.api_engine.opts.yml`, `.api_engine.opts.yaml` or
    `.api_engine.opts.json` file in the current directory, or any parent
    directory. This is the preferred method.

See [here](server.md#server-options) for a list of available server options.

# Configuration file

The [IDL file](#idl-file) and the [server options file](#server-options) share
the same format.

The file format depends on the file extension, and can be either YAML or JSON.
YAML files can only contain JSON-compatible types.

If a relative file path is used to target the configuration file, it will be
relative to the current directory.

The [IDL file](#idl-file) (but not the [server options file](#server-options))
can also be broken down into several files or use libraries. It does so by
referring to external files (local or remote) or Node.js modules, using
[JSON references](https://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03),
e.g.:

```yml
models:
  user:
    $ref: user.yml
```

# Environment variables

Environment variables prefixed with `API_ENGINE__` can be specified to override
specific server options.

E.g. the following environment variables:
```bash
API_ENGINE__MAX_PAGE_SIZE=200
API_ENGINE__HTTP__HOST=myhost
API_ENGINE__LOG_FILTER__PAYLOAD__0=id
API_ENGINE__LOG_FILTER__PAYLOAD__1=old_id
```

will be converted to the following server options, which will override
(but not fully replace) the current server options:

```json
{
  "maxPageSize": 200,
  "http": { "host": "myhost" },
  "logFilter": { "payload": ["id", "old_id"] },
}
```

Notice that:
  - the names are converted to camelCase
  - `__` is used to nest objects and arrays

Additionally, the following environment variables can be used:
  - `NODE_ENV`: for the server option `env`
  - `HOST`: for the server options `http.host`
  - `PORT`: for the server options `http.port`
