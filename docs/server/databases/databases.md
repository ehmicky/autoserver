# Databases

Databases are specified with the `collection.database`
[configuration property](../usage/configuration.md#properties).

```yml
collections:
  example_collection:
    database: mongodb
```

This means multiple databases can be mixed on the same API, and collections can
either share the same databases or use different ones.

# Available databases

The default database is [`memory`](../databases/memorydb.md), an in-memory database,
for development purpose.

The other available databases are:
  - [`mongodb`](../databases/mongodb.md)

To change the default database, use a
[`default` collection](../configuration/collections.md#default-collection).

# Databases options

Databases options are specified with the `databases`
[configuration property](../usage/configuration.md#properties).

```yml
databases:
  memory:
    save: false
```

specifies that the `memory` database should disable the `save` option.
