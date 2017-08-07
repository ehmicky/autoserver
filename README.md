[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

This is a web server engine.

You simply pass a single declarative file as input, and a
full-featured GraphQL server will start.

# Features

  - standard-compliant HTTP server
  - GraphQL endpoint, including introspection, interactive debugger and
    schema printing
  - CRUD actions: find, create, update, replace, upsert, delete.
    Each action can be performed on a single model or on several models.
  - nested actions and populating between models, including for mutations
  - filtering, which can use custom logic
  - sorting
  - selecting
  - pagination
  - dry runs
  - input validation
  - default values
  - transformation on input, e.g. for normalization
  - computed values, e.g. `name = first_name + last_name`
  - automatic attributes: `created_time`, `updated_time`, `created_by`,
    `updated_by`
  - extensive error handling and logging capabilities

# Starting the server

See [here](docs/start.md).

# Client queries

You can learn how to perform queries against this server [here](docs/graphql.md)
and [here](docs/http.md).

# Contribute

See [here](CONTRIBUTE.md).
