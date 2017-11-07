[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

This is a web server engine.

You simply pass a single [declarative file](docs/schema.md) as input, and a
full-featured [GraphQL](http://graphql.org/) server will start.

# Features

  - [Multiple RPC systems](docs/rpc.md), including
    [GraphQL](docs/graphql.md)
  - [GraphQL debugging](docs/graphql.md),
    including introspection, interactive debugger and GraphQL schema printing
  - [Database agnostic](docs/databases.md), with support for several databases,
    including [MongoDB](docs/mongodb.md) and an
    [in-memory database](docs/memory_db.md).
    Multiple databases can even be mixed on the same API
  - [Multiple protocols](docs/protocols.md) handling, with support for
    [HTTP/1.1](docs/http.md) only at the moment
  - [CRUD commands](docs/crud.md): find, create, patch, upsert, delete.
    Each command can be performed on a single model or on several models.
  - [relations, nested commands](docs/relations.md)
    and [populating](docs/selecting.md#populating) between models,
    including for mutations
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
