[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

This generates a full-featured web API from a
[configuration file](docs/server/usage/configuration.md#configuration-file).

# Features

  - [Multiple RPC systems](docs/client/syntax/rpc.md), including [REST](docs/client/syntax/rest.md),
    [GraphQL](docs/client/syntax/graphql.md) and [JSON-RPC](docs/client/syntax/jsonrpc.md)
  - [GraphQL debugging](docs/client/syntax/graphql.md),
    including introspection, interactive debugger and GraphQL schema printing
  - [Multiple databases](docs/server/databases/databases.md) support, including
    [MongoDB](docs/server/databases/mongodb.md) and an [in-memory database](docs/server/databases/memorydb.md).
    Different databases can be used at the same time.
  - [Multiple protocols](docs/server/protocols/protocols.md) handling, with support for
    [HTTP/1.1](docs/server/protocols/http.md) only at the moment
  - [Multiple formats](docs/client/arguments/formats.md) support for the configuration
    files, the client request payloads and the server responses, including
    [JSON](docs/client/arguments/formats.md#json), [YAML](docs/client/arguments/formats.md#yaml),
    [x-www-form-urlencoded](docs/client/arguments/formats.md#x-www-form-urlencoded),
    [JavaScript](docs/server/usage/formats.md#javascript),
    [Hjson](docs/client/arguments/formats.md#hjson),
    [JSON5](docs/client/arguments/formats.md#json5) and [INI](docs/client/arguments/formats.md#ini)
  - automatic [logging](docs/server/configuration/logging.md) and
    [performance monitoring](docs/server/configuration/logging.md#performance-monitoring)
  - extensive [error handling and reporting](docs/server/usage/error.md)
  - [CRUD commands](docs/client/query/crud.md): find, create, patch, upsert, delete.
    Each command can be performed on a single model or on several models.
  - [Advanced mutations](docs/client/query/patch.md) like incrementing,
    regular expression replacement, cross-attributes mutations, slicing, etc.
  - [relations, nested commands](docs/client/query/relations.md)
    and populating between models, including for mutations
  - [filtering](docs/client/arguments/filtering.md)
  - [sorting](docs/client/arguments/sorting.md)
  - [selecting](docs/client/arguments/selecting.md)
  - [renaming attributes](docs/client/arguments/renaming.md)
  - [pagination](docs/client/arguments/pagination.md)
  - [input validation](docs/server/configuration/validation.md#data-validation)
  - [authorization](docs/server/configuration/authorization.md), including
    [readonly](docs/server/configuration/authorization.md#readonly-attributes) attributes
  - [default values](docs/server/usage/default.md)
  - [computed attributes and normalization](docs/server/configuration/transformation.md)
  - [aliases](docs/server/configuration/compatibility.md#aliases)
  - automatic attributes:
    [`created_time`, `updated_time`](docs/server/usage/plugins.md#timestamps),
    [`created_by`, `updated_by`](docs/server/usage/plugins.md#model-authors)
  - [compression](docs/client/arguments/compression.md) of both the response and the request,
    for any protocol. [Brotli](https://en.wikipedia.org/wiki/Brotli) support.
  - [dry runs](docs/client/dryserver/usage/run.md)
  - [silent outputs](docs/client/arguments/silent.md)
  - [plugins](docs/server/usage/plugins.md)
  - [custom logic](docs/server/usage/functions.md) can be added in JavaScript

# Missing features

See the [roadmap](ROADMAP.md).

# Usage

You can learn:
  - how to run the server [here](docs/server/usage/usage.md).
  - how to perform queries against this server [here](docs/client/syntax/rpc.md)

# Contribute

See [here](CONTRIBUTING.md).
