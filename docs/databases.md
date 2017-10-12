# Databases

Databases and their connection options are specified with the
`run` option `db`, e.g.:

```yml
db:
  memory:
    save: false
  mongodb: {}
```

uses two databases: a `memory` database with the `save` option disabled,
and MongoDB with no options.

See [here](configuration.md) to learn how to specify the `run` option.

# Available databases

Available databases are:
  - [`memory`](memory_db.md): in-memory database, for development purpose

# Model kinds

You declare model `kind`s by setting `model.kind` in the [schema](schema.md),
which defaults to `['data', 'search']`, e.g.:

```yml
models:
  user:
    kind: [data]
```

Each model `kind` whitelists specific client query arguments on that model,
namely:
  - `data`: most arguments
  - `search`: [advanced `filter` argument](filtering.md#advanced-filtering)

Each database supports a limited set of model `kind`s.
E.g. a key-value store might not support advanced filtering.

Model kinds allow you to use different kind of data/databases in the same
server, e.g. mixing static assets, regular data, time-series, etc. in a single
unified API.

# Multiple databases

You can use several databases in the same API.

Each model is handled by a single database. Client queries can be nested
though, manipulating several models, i.e. several databases in a single
operation.

By default, a model will use the first database that can handle all its
[`kind`s](#model-kinds).
But one can target models to specific databases with the `run` option
`db.DATABASE.models` which is an array of strings of either:
  - names of the models to target
  - [kinds](#model-kinds) of the models to target, prefixed with `kind:`

E.g. with the following options:

```yml
db:
  memory:
    models: [user]
  mongodb:
    models: [manager, kind:search]
```

the in-memory database will be used for the model `user`, while MongoDB will be
used for the model `manager` and any model with `kind` `search`.
