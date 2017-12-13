[![js-standard-style](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

This generates a full-featured web API from a
[configuration file](docs/server/configuration/configuration.md#configuration-file).

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
  - extensive [error handling and reporting](docs/server/usage/error.md)
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
  - [custom logic](docs/server/configuration/functions.md) can be added in JavaScript

# Missing features

See the [roadmap](ROADMAP.md).

# Usage

You can learn:
  - how to run the server [here](docs/server/usage/README.md).
  - how to perform client requests against this server
    [here](docs/client/rpc/README.md)

# Contribute

See [here](CONTRIBUTING.md).
