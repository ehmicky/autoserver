# Configuration

[Configuration properties](#properties) are used by the
[`run`](../usage/run.md) instruction.

There are several ways to define [configuration properties](#properties).
If several are used, they are merged together (from the highest priority to
the lowest):
  - setting an [environment variable](#environment-variables):
    `APIENGINE__LIMITS__PAGESIZE=10`
  - using a command line option: `apiengine run --limits.pagesize=10`
  - passing the option via Node.js:
    `apiengine.run({ limits: { pagesize: 10 } })`
  - using a [configuration file](#configuration-file)

```yml
limits:
  pagesize: 10
```

# Properties

The following configuration properties are available:
  - `engine` `{string}` (required) - file format version. Must equal `0`
  - `name` `{string}` - sets the [parameter](../usage/functions.md#parameters)
    `serverinfo.process.name`
  - `env` (defaults to `dev`): can be `dev` or `production`.
    Running in `dev` mode will add some developer-friendly features, e.g.
    disable request timeouts during breakpoint debugging.
  - `collections` `{object}` (required) - list of
    [collections](../configuration/collections.md#collections)
    - `COLLECTION` `{object}` - `COLLECTION` is the name
      - `attributes` `{object}` - list of the collections's
        [attributes](../configuration/collections.md#attributes)
        - `ATTRIBUTE` `{object}` - `ATTRIBUTE` is the name
  - `params` `{object}` -
    [server-specific parameters](../usage/functions.md#server-specific-parameters)
  - `plugins` `{object}` - see [plugins](../usage/plugins.md)
  - `authorize` `{object}` - see [authorization](../configuration/authorization.md)
  - `validation` `{object}` -
    [custom validation keywords](../configuration/validation.md#custom-validation)
  - `operators` `{object}` -
    [custom patch operators](../configuration/patch.md#custom-operators)
  - `log` `{object}` - [logging configuration](../configuration/logging.md)
  - `protocols` `{object}`: [protocols options](../protocols/protocols.md#options)
  - `databases` `{object}`: [databases options](../databases/databases.md)
  - `limits` `{object}`: see [limits](../configuration/limits.md)

# Configuration file

The path of the configuration file is specified using the
`config` [option](../usage/run.md).

The file format can be any of the [supported formats](../usage/formats.md).

By default, any file named `apiengine.config.EXTENSION` will be searched in
the current directory, or any parent. `EXTENSION` depends on the file format,
e.g. `yml` for YAML.

The configuration can be broken down into several files or import Node.js
modules by using [JSON references](../usage/json_references.md).

# Example

The configuration file below:
  - describes two collections:
    - a `companies` collection with attributes `id` (defined by default)
      and `registration_no`
    - a `users` collection with attributes `id`, `name` and `employer`
      (pointing to a `companies` collection)
  - set the [HTTP](../protocols/http.md) port to `5001`

```yml
engine: 0
collections:
  companies:
    description: This is a company
    attributes:
      registration_no:
        type: number
  users:
    attributes:
      name:
        description: This is the name of a users
      employer:
        type: companies
protocols:
  http:
    port: 5001
```

# Environment variables

[Configuration properties](#properties) can be set using environment variables
prefixed with `APIENGINE__`.

```toml
APIENGINE__ENV="dev"
APIENGINE__LIMITS__PAGESIZE=200
APIENGINE__PROTOCOLS__HTTP__HOSTNAME="myhostname"
```

The example above will be converted to the following
[configuration properties](#properties).

```yml
env: dev
limits:
  pagesize: 200
protocols:
  http:
    hostname: myhostname
```

`__` is used to nest object and arrays.

JSON values can be used, including booleans, numbers, `null`, objects and
arrays.

Some well-known environment variables can also be used as alternative names,
namely:
  - `NODE_ENV`: same as `APIENGINE__ENV`
  - `HOST`: same as `APIENGINE__PROTOCOLS__HTTP__HOSTNAME`
  - `PORT`: same as `APIENGINE__PROTOCOLS__HTTP__PORT`

# Metadata

To add properties only meant as metadata, prefix them with `$` at the
top-level, on a collection or on an attribute.

```yml
collections:
  example_collection:
    $my_custom_prop: 3
```
