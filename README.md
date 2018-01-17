[![js-standard-style](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://standardjs.com/)

# Overview

Create a simple
[configuration file](docs/server/configuration/configuration.md#configuration-file)
describing your data model:

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

Then start a full-featured web API by typing in the console:

```bash
apiengine run
```

Clients will now be able to perform [GraphQL](docs/client/rpc/graphql.md)
requests:

```graphql
{
  find_users(
    filter: { score: { _gt: 100 } }
    order: "score"
  ) {
    id
    age
    score
    reports: { content }
  }
}
```

Or [REST](docs/client/rpc/rest.md) requests:

```HTTP
GET /rest/users/?filter.score._gt=100&order=score&populate=reports
```

```json
{
  "data": [
    {
      "id": "15",
      "age": 32,
      "score": 150,
      "reports": { "id": "65", "content": "..." }
    },
    {
      "id": "251",
      "age": 24,
      "score": 168,
      "reports": { "id": "67", "content": "..." }
    },
    {
      "id": "7",
      "age": 51,
      "score": 192,
      "reports": { "id": "10", "content": "..." }
    }
  ]
}
```

# Features

  - [Multiple RPC systems](docs/client/rpc/README.md), including
    [REST](docs/client/rpc/rest.md),
    [GraphQL](docs/client/rpc/graphql.md) and
    [JSON-RPC](docs/client/rpc/jsonrpc.md)
  - [GraphQL debugging](docs/client/rpc/graphql.md),
    including introspection, interactive debugger and GraphQL schema printing
  - [Multiple databases](docs/server/databases/README.md) support, including
    [MongoDB](docs/server/databases/mongodb.md) and an
    [in-memory database](docs/server/databases/memorydb.md).
    Different databases can be used at the same time.
  - [Multiple protocols](docs/client/protocols/README.md) handling, with
    support for [HTTP/1.1](docs/server/protocols/http.md) only at the moment
  - [Multiple formats](docs/client/protocols/formats.md) support for the
    configuration files, the client request payloads and the server responses,
    including [JSON](docs/client/protocols/formats.md#json),
    [YAML](docs/client/protocols/formats.md#yaml),
    [x-www-form-urlencoded](docs/client/protocols/formats.md#x-www-form-urlencoded),
    [JavaScript](docs/server/configuration/formats.md#javascript),
    [Hjson](docs/client/protocols/formats.md#hjson),
    [JSON5](docs/client/protocols/formats.md#json5) and
    [INI](docs/client/protocols/formats.md#ini)
  - automatic [logging](docs/server/quality/logging.md) and
    [performance monitoring](docs/server/quality/logging.md#performance-monitoring)
  - extensive
    [error handling and reporting](docs/server/usage/error.md#exceptions)
  - [CRUD commands](docs/client/request/crud.md): find, create, patch, upsert,
    delete.
    Each command can be performed on a single model or on several models.
  - [Advanced mutations](docs/client/request/patch.md) like incrementing,
    regular expression replacement, cross-attributes mutations, slicing, etc.
  - [relations, nested commands](docs/client/request/relations.md)
    and populating between models, including for mutations
  - [filtering](docs/client/arguments/filtering.md)
  - [sorting](docs/client/arguments/sorting.md)
  - [selecting](docs/client/arguments/selecting.md)
  - [renaming attributes](docs/client/arguments/renaming.md)
  - [pagination](docs/client/arguments/pagination.md)
  - [input validation](docs/server/data_model/validation.md#data-validation)
  - [authorization](docs/server/data_model/authorization.md), including
    [readonly](docs/server/data_model/authorization.md#readonly-attributes)
    attributes
  - [default values](docs/server/data_model/default.md)
  - [computed attributes and normalization](docs/server/data_model/transformation.md)
  - [aliases](docs/server/data_model/compatibility.md#aliases)
  - automatic attributes:
    [`created_time`, `updated_time`](docs/server/plugins/timestamp.md),
    [`created_by`, `updated_by`](docs/server/plugins/author.md)
  - [compression](docs/client/arguments/compression.md) of both the response
    and the request, for any protocol.
    [Brotli](https://en.wikipedia.org/wiki/Brotli) support.
  - [dry runs](docs/client/arguments/dryrun.md)
  - [silent outputs](docs/client/arguments/silent.md)
  - [plugins](docs/server/plugins/README.md)
  - [custom logic](docs/server/configuration/functions.md) can be added in
    JavaScript

# Documentation

The documentation is [here](docs/README.md).
