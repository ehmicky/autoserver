# Databases

Databases are specified with `collection.database`, e.g.:

```yml
collections:
  example_collection:
    database: mongodb
```

This means multiple databases can be mixed on the same API, and collections can
either share the same databases or use different ones.

# Available databases

The default database is [`memory`](memory_db.md), an in-memory database,
for development purpose.

The other available databases are:
  - [`mongodb`](mongodb.md)

# Databases options

Databases options are specified with the schema property `databases`, e.g.:

```yml
databases:
  memory:
    save: false
```

specifies that the `memory` database should disable the `save` option.
