# Configuration

The data model and business logic is specified in the configuration used by
the [`run`](../usage/run.md) instruction.

There are several ways to define [configuration properties](#properties).
If several are used, they are merged together (from the highest priority to
the lowest):
  - setting an [environment variable](#environment-variables):
    `APIENGINE__LIMITS__PAGESIZE=10`
  - using a [command line option](../usage/README.md#usage):
    `apiengine run --limits.pagesize=10`
  - passing the option via [Node.js](../usage/README.md#node.js):
    `apiengine.run({ limits: { pagesize: 10 } })`
  - using a [configuration file](#configuration-file)

```yml
limits:
  pagesize: 10
```

# Properties

The following configuration properties are available:
  - `engine` `{integer}` (required) -
    [configuration format version](#configuration-format-version)
  - `name` `{string}` - sets the [parameter](functions.md#parameters)
    `serverinfo.process.name`
  - `env` (defaults to `dev`): can be `dev` or `production`.
    Running in `dev` mode will add some developer-friendly features, e.g.
    disable request timeouts during breakpoint debugging.
  - `collections` `{object}` (required) - list of
    [collections](../data_model/collections.md#collections)
    - `COLLECTION` `{object}` - `COLLECTION` is the name
      - `attributes` `{object}` - list of the collection's
        [attributes](../data_model/collections.md#attributes)
        - `ATTRIBUTE` `{object}` - `ATTRIBUTE` is the name
  - `params` `{object}` -
    [server-specific parameters](functions.md#server-specific-parameters)
  - `plugins` `{object}` - [plugins](../plugins/README.md)
  - `authorize` `{object}` - [authorization](../data_model/authorization.md)
  - `validation` `{object}` -
    [custom validation keywords](../data_model/validation.md#custom-validation)
  - `operators` `{object}` -
    [custom patch operators](../data_model/patch.md#custom-operators)
  - `log` `{object}` - [logging configuration](../quality/logging.md)
  - `protocols` `{object}`:
    [protocols options](../protocols/README.md#options)
  - `databases` `{object}`: [databases options](../databases/README.md)
  - `limits` `{object}`: [limits](../quality/limits.md)

# Configuration file

The path of the configuration file is specified using the
`config` [option](../usage/run.md).

The file format can be any of the [supported formats](formats.md).

By default, any file named `apiengine.config.EXTENSION` will be searched in
the current directory, or any parent. `EXTENSION` depends on the file format,
e.g. `yml` for YAML.

The configuration can be broken down into several files or import Node.js
modules by using [references](references.md).

# Example

The configuration file below:
  - describes two collections:
    - a `users` collection with attributes `id`, `age`, `score` and `reports`
      (pointing to the `reports` collection)
    - a `reports` collection with attributes `id` and `content`
  - sets up the [MongoDB](../databases/mongodb.md) connection options
  - sets the [HTTP](../protocols/http.md) port to `5001`

```yml
engine: 0
collections:
  users:
    description: User of the API
    attributes:
      id:
        type: string
      age:
        type: integer
      score:
        type: number
        alias: high_score
        default: 10
        validate:
          minimum: 20
      reports:
        type: reports[]
  reports:
    attributes:
      id:
        type: string
      content:
        type: string
  default:
    database: mongodb
databases:
  mongodb:
    hostname: localhost
    password: secret_mongodb_password
    dbname: my_database_name
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

# Configuration format version

The format of the configuration is versioned. The latest version is `0`.

It must be specified under the [configuration property](#properties) `engine`.

```yml
engine: 0
```

# Metadata

To add properties only meant as metadata, prefix them with `$` at the
top-level, on a collection or on an attribute.

```yml
collections:
  example_collection:
    $my_custom_prop: 3
```
