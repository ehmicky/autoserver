# Databases

Databases and their connection options are specified with the
[`run` option](configuration.md) `db`, e.g.:

```yml
db:
  memory:
    save: false
```

uses a `memory` database with the `save` option disabled.

# Available databases

  - [`memory`](memory_db.md): in-memory database, for development purpose

# API features support

Some databases do not support all the features of the API.
E.g. the [advanced `filter` argument](filtering.md#advanced-filtering) is not
supported by all databases.

# Multiple databases

One can use several databases in the same API.

If so, one must define which models each database is handling, using the
[`run` option](configuration.md) `db.DATABASE.models`, which is an array of
model names. The special value `...` can be used to target all the
remaining models. For example:

```yml
db:
  mongodb:
    models: [user, manager]
  memory:
    models: [...]
```

Here, MongoDB will be used for the models `user` and `manager`, and the
in-memory database for all the other models.
