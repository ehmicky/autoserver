[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

This is a web server engine.

You create a single [declarative file](docs/schema.md) as input, and a
full-featured [REST](docs/rest.md) / [GraphQL](docs/graphql.md) /
[JSON-RPC](docs/jsonrpc.md) server will start.

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
  - [CRUD commands](docs/crud.md): find, create, patch, upsert, delete.
    Each command can be performed on a single model or on several models.
  - [relations, nested commands](docs/relations.md)
    and populating between models, including for mutations
  - [filtering](docs/filtering.md)
  - [sorting](docs/sorting.md)
  - [selecting](docs/selecting.md)
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
  - [dry runs](docs/dryrun.md)
  - [silent outputs](docs/silent.md)
  - [custom JavaScript logic](docs/functions.md)
  - [plugins](docs/plugins.md)
  - extensive [error handling](docs/error.md) and
    [logging](docs/events.md#logging) capabilities
  - [performance monitoring](docs/performance.md#performance-monitoring)

# Missing features

See the [roadmap](ROADMAP.md).

# Starting the server

See [here](docs/usage.md).

# Client queries

You can learn how to perform queries against this server [here](docs/graphql.md)

# Contribute

See [here](CONTRIBUTING.md).
