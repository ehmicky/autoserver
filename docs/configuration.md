# Configuration

Each instruction has its own set of options.
Let's take the option `maxPageSize` from the instruction `run` as an example.

There are several ways to define options.
If several are used, they are merged together (from the highest priority to
the lowest):
  - setting an [environment variable](#environment-variables):
    `API_ENGINE__MAX_PAGE_SIZE=10`
  - using a command line option: `apiengine run --max-page-size=10`.
    Note that the option name uses dashes on the command line.
  - passing the option via Node.js: `apiEngine.run({ maxPageSize: 10 })`
  - using a [configuration file](#configuration-file)

# Configuration file

A configuration file can be specified for each instruction, e.g. for `run`
(from the highest priority to the lowest):
  - setting an environment variable `API_ENGINE__CONFIG="path_to_config"`
  - using the command line: `apiengine run --config="path_to_config"`.
  - passing it via Node.js: `apiEngine.run({ config: 'path_to_config' })`
  - creating a `api_engine.run.config.yml`, `api_engine.run.config.yaml` or
    `api_engine.run.config.json` file in the current directory, or any parent
    directory. This is the preferred method.

The file contains a set of options for a given instruction, e.g.:

```yml
http:
  host: myhost
maxPageSize: 10
```

The format depends on the file extension, and can be either JSON or YAML
(but only with JSON-compatible types).

If a relative file path is used to target the configuration file, it will be
relative to the current directory.

# Environment variables

Environment variables are all prefixed with `API_ENGINE__`.
E.g. the following environment variables:

```toml
API_ENGINE__ENV="dev"
API_ENGINE__MAX_PAGE_SIZE=200
API_ENGINE__HTTP__HOST="myhost"
API_ENGINE__EVENT_FILTER__PAYLOAD="[id,old_id]"
```

will be converted to the following options:

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
  - `__` is used to nest objects
  - `[..., ...]` is used for arrays

Some well-known environment variables can also be used as aliases, namely:
  - for the `run` instruction:
     - `NODE_ENV`: same as `API_ENGINE__ENV`
     - `HOST`: same as `API_ENGINE__HTTP__HOST`
     - `PORT`: same as `API_ENGINE__HTTP__PORT`

# Filepaths options

Some options are filepaths, i.e. they target another file.

The following options use filepaths:
  - [`events`](events.md) option, in [`run` instruction](run.md)
  - [`schema`](schema.md) option, in [`run` instruction](run.md)

The path will be relative to the [configuration file](#configuration-file).
If there is no configuration file, it will be relative to the current directory.

The filepaths of those options always default to any file named
`api_engine.INSTRUCTION.OPTION.EXTENSION`:
  - `INSTRUCTION` and `OPTION` depend on the option
  - `EXTENSION` is the file format. The available choices depend on the option.
  - the file can be in the current directory, or any parent.
