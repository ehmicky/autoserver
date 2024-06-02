# Server

## Installation

```shell
$ npm install autoserver
```

## Usage

To run the server from the [command line](usage/README.md#usage):

```shell
$ autoserver run
```

or from [Node.js](usage/README.md#nodejs):

```js
import { run } from 'autoserver'

run()
```

## Configuration

The [configuration](configuration/README.md) can be passed directly as
[command line](usage/README.md#usage) or [Node.js](usage/README.md#nodejs)
options, but is usually specified using a
[configuration file](configuration/configuration.md#configuration-file) named
`autoserver.config.yml` in the current directory.

It can be divided into [several files](configuration/references.md), use custom
[functions](configuration/functions.md) or import
[Node.js modules](configuration/references.md#nodejs-modules).

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

## Data model

The [configuration](configuration/README.md) specifies the
[data model](data_model/README.md), including the list of
[collections](data_model/collections.md),
[attributes](data_model/collections.md#attributes) and their
[relations](data_model/relations.md) to each other.

It also includes any logic related to
[authorization](data_model/authorization.md),
[readonly](data_model/authorization.md#readonly-attributes) attributes,
[data validation](data_model/validation.md),
[default values](data_model/default.md),
[computing and transforming](data_model/transformation.md) attributes,
[aliasing](data_model/compatibility.md) and custom
[patch operators](data_model/patch.md).

## Plugins

[Plugins](plugins/README.md) can be used to extend functionalities such as
automatically adding [timestamps](plugins/timestamp.md) and
[`created_by|updated_by`](plugins/author.md) attributes

## Software quality

The following can also be [configured](quality/README.md):
[logging](quality/logging.md),
[performance monitoring](quality/logging.md#performance-monitoring),
[API documentation](quality/documentation.md) and [limits](quality/limits.md).

## Protocols

The server is protocol-agnostic. However, for the moment, the only supported
[protocol](protocols/README.md) is [HTTP](protocols/http.md).

## Databases

The server is database-agnostic. The following [databases](databases/README.md)
are currently supported: an [in-memory database](databases/memorydb.md) and
[MongoDB](databases/mongodb.md).

# Server (table of contents)

[Usage](usage/README.md)

- [Running the server](usage/run.md)
- [Server errors](usage/error.md#exceptions)

[Configuration](configuration/README.md)

- [How to specify the configuration](configuration/configuration.md)
- [Configuration file formats](configuration/formats.md)
- [Breaking the configuration file into several parts](configuration/references.md)
- [Custom logic](configuration/functions.md)

[Data model](data_model/README.md)

- [Collections and attributes](data_model/collections.md)
- [Relations between collections](data_model/relations.md)
- [Authorization and readonly attributes](data_model/authorization.md)
- [Data validation](data_model/validation.md)
- [Default values](data_model/default.md)
- [Computing and transforming attributes](data_model/transformation.md)
- [Aliasing](data_model/compatibility.md)
- [Custom patch operators](data_model/patch.md)

[Plugins](plugins/README.md)

- [Timestamps](plugins/timestamp.md)
- [`created_by` and `updated_by`](plugins/author.md)

[Software quality](quality/README.md)

- [Logging](quality/logging.md)
- [Performance monitoring](quality/logging.md#performance-monitoring)
- [API documentation](quality/documentation.md)
- [Server limits](quality/limits.md)

[Protocols](protocols/README.md)

- [HTTP](protocols/http.md)

[Databases](databases/README.md)

- [In-memory database](databases/memorydb.md)
- [MongoDB](databases/mongodb.md)
