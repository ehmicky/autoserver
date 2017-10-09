[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

This is a web server engine.

You simply pass a single [declarative file](docs/idl.md) as input, and a
full-featured [GraphQL](http://graphql.org/) server will start.

# Features

  - standard-compliant HTTP server
  - [GraphQL endpoint](docs/graphql.md#client-queries),
    including introspection, interactive debugger and GraphQL schema printing
  - [CRUD commands](docs/graphql.md#read-queries):
    find, create, patch, replace, delete.
    Each command can be performed on a single model or on several models.
  - [relations, nested commands](docs/relations.md)
    and populating between models, including for mutations
  - [filtering](docs/filtering.md), which can use custom logic
  - [sorting](docs/sorting.md)
  - [selecting](docs/selecting.md)
  - [pagination](docs/pagination.md)
  - [dry runs](docs/dryrun.md)
  - [silent outputs](docs/silent.md)
  - [input validation](docs/validation.md#data-validation)
  - [default values](docs/transformation.md#default-values)
  - [readonly](docs/readonly.md) attributes
  - [aliases](docs/compatibility.md#aliases)
  - [transformation on input](docs/transformation.md#transformations),
    e.g. for normalization
  - [computed values](docs/transformation.md#computed-attributes),
    e.g. `name = first_name + last_name`
  - [authorization](docs/authorization.md)
  - automatic attributes:
    [`created_time`, `updated_time`](docs/plugins.md#timestamps),
    [`created_by`, `updated_by`](docs/plugins.md#model-authors)
  - [custom JavaScript logic](docs/functions.md) and [plugins](docs/plugins.md)
  - extensive [error handling](docs/error.md) and
    [logging](docs/events.md#logging) capabilities
  - [performance monitoring](docs/performance.md#performance-monitoring)
  - [request timeout](docs/performance.md#request-timeout)

# Missing features

See the [roadmap](ROADMAP.md).

# Starting the server

See [here](docs/usage.md).

# Client queries

You can learn how to perform queries against this server [here](docs/graphql.md)

# Contribute

See [here](CONTRIBUTE.md).
