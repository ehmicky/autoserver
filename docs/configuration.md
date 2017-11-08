# Configuration

Each instruction has its own set of options.
Let's take the option `maxpagesize` from the instruction `run` as an example.

There are several ways to define options.
If several are used, they are merged together (from the highest priority to
the lowest):
  - setting an [environment variable](#environment-variables):
    `APIENGINE_MAXPAGESIZE=10`
  - using a command line option: `apiengine run --maxpagesize=10`.
    Note that the option name uses dashes on the command line.
  - passing the option via Node.js: `apiengine.run({ maxpagesize: 10 })`
  - using a [configuration file](#configuration-file)

# Configuration file

A configuration file can be specified for each instruction, e.g. for `run`
(from the highest priority to the lowest):
  - setting an environment variable `APIENGINE_CONFIG="path_to_config"`
  - using the command line: `apiengine run --config="path_to_config"`.
  - passing it via Node.js: `apiengine.run({ config: 'path_to_config' })`
  - creating a `apiengine.run.config.yml`, `apiengine.run.config.yaml` or
    `apiengine.run.config.json` file in the current directory, or any parent
    directory. This is the preferred method.

The file contains a set of options for a given instruction, e.g.:

```yml
protocols:
  http:
    hostname: myhostname
maxpagesize: 10
```

The format depends on the file extension, and can be either JSON or YAML
(but only with JSON-compatible types).

If a relative file path is used to target the configuration file, it will be
relative to the current directory.

# Environment variables

Environment variables are all prefixed with `APIENGINE_`.
E.g. the following environment variables:

```toml
APIENGINE_ENV="dev"
APIENGINE_MAXPAGESIZE=200
APIENGINE_PROTOCOLS_HTTP_HOSTNAME="myhostname"
APIENGINE_FILTER_PAYLOAD="[id,old_id]"
```

will be converted to the following options:

```json
{
  "env": "dev",
  "maxpagesize": 200,
  "protocols": { "http": { "hostname": "myhostname" } },
  "filter": { "payload": ["id", "old_id"] },
}
```

Note:
  - the names are converted to camelCase
  - `_` is used to nest objects
  - `[..., ...]` is used for arrays

Some well-known environment variables can also be used as alternative names,
namely:
  - for the `run` instruction:
     - `NODE_ENV`: same as `APIENGINE_ENV`
     - `HOST`: same as `APIENGINE_HTTP_HOST`
     - `PORT`: same as `APIENGINE_HTTP_PORT`

# Filepaths options

Some options are filepaths, i.e. they target another file.

The following options use filepaths:
  - [`events`](events.md) option, in [`run` instruction](run.md)
  - [`schema`](schema.md) option, in [`run` instruction](run.md)

The path will be relative to the [configuration file](#configuration-file).
If there is no configuration file, it will be relative to the current directory.

The filepaths of those options always default to any file named
`apiengine.INSTRUCTION.OPTION.EXTENSION`:
  - `INSTRUCTION` and `OPTION` depend on the option
  - `EXTENSION` is the file format. The available choices depend on the option.
  - the file can be in the current directory, or any parent.
