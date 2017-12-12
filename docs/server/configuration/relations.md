# Nested collections

Collections can refer to each other by using the other collection's name as
the `attribute.type`
[configuration property](server/usage/configuration.md#properties), either as a scalar
value or an array, for one-to-one or one-to-many relationship.

```yml
collections:
  users:
    attributes:
      friends:
        type: users[]
      manager:
        type: users
```

Models can nest themselves, i.e. be recursive.

Nested attributes are using the `id` attribute of the collection they refer to.

Nested collections can be
[populated](../client/query/relations.md#populating-nested-collections),
[modified](../client/query/relations.md#modifying-nested-collections) and
[deleted](../client/query/relations.md#deleting-nested-collections) by client.
