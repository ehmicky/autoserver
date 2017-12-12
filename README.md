[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

This generates a full-featured web API from a [configuration file](docs/schema.md).

# Features

  - [Multiple RPC systems](docs/rpc.md), including [REST](docs/rest.md),
    [GraphQL](docs/graphql.md) and [JSON-RPC](docs/jsonrpc.md)
  - [GraphQL debugging](docs/graphql.md),
    including introspection, interactive debugger and GraphQL schema printing
  - [Multiple databases](docs/databases.md) support, including
    [MongoDB](docs/mongodb.md) and an [in-memory database](docs/memory_db.md).
    Different databases can be used at the same time.
  - [Multiple protocols](docs/protocols.md) handling, with support for
    [HTTP/1.1](docs/http.md) only at the moment
  - [Multiple formats](docs/formats.md) support for the configuration files,
    the client request payloads and the server responses, including
    [JSON](docs/formats.md#json), [YAML](docs/formats.md#yaml),
    [x-www-form-urlencoded](docs/formats.md#x-www-form-urlencoded),
    [JavaScript](docs/formats.md#javascript), [Hjson](docs/formats.md#hjson),
    [JSON5](docs/formats.md#json5) and [INI](docs/formats.md#ini)
  - automatic [logging](docs/logging.md) and
    [performance monitoring](docs/logging.md#performance-monitoring)
  - extensive [error handling and reporting](docs/error.md)
  - [CRUD commands](docs/crud.md): find, create, patch, upsert, delete.
    Each command can be performed on a single model or on several models.
  - [Advanced mutations](docs/patch.md) like incrementing, regular expression
    replacement, cross-attributes mutations, slicing, etc.
  - [relations, nested commands](docs/relations.md)
    and populating between models, including for mutations
  - [filtering](docs/filtering.md)
  - [sorting](docs/sorting.md)
  - [selecting](docs/selecting.md)
  - [renaming attributes](docs/renaming.md)
  - [pagination](docs/pagination.md)
  - [input validation](docs/validation.md#data-validation)
  - [authorization](docs/authorization.md), including
    [readonly](docs/authorization.md#readonly-attributes) attributes
  - [default values](docs/default.md)
  - [computed attributes and normalization](docs/transformation.md)
  - [aliases](docs/compatibility.md#aliases)
  - automatic attributes:
    [`created_time`, `updated_time`](docs/plugins.md#timestamps),
    [`created_by`, `updated_by`](docs/plugins.md#model-authors)
  - [compression](docs/compression.md) of both the response and the request,
    for any protocol. [Brotli](https://en.wikipedia.org/wiki/Brotli) support.
  - [dry runs](docs/dryrun.md)
  - [silent outputs](docs/silent.md)
  - [plugins](docs/plugins.md)
  - [custom logic](docs/functions.md) can be added in JavaScript

# Missing features

See the [roadmap](ROADMAP.md).

# Starting the server

See [here](docs/usage.md).

# Client queries

You can learn how to perform queries against this server [here](docs/graphql.md)

# Contribute

See [here](CONTRIBUTING.md).
