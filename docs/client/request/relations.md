# Populating nested collections

Clients can populate nested collections in output with the `populate`
[argument](../rpc/README.md#rpc).
It is a comma-separated list of attribute names. Nested attributes can be
specified using a dot notation.

The example below populates `manager` and `manager.colleague`.

```HTTP
GET /rest/users/1?populate=manager,manager.colleague
```

```json
{
  "data": {
    "id": "1",
    "name": "Anthony",
    "manager": {
      "id": "3",
      "name": "Anna",
      "colleague": {
        "id": "4",
        "name": "David"
      }
    }
  }
}
```

[GraphQL](../rpc/graphql.md#selection-population-and-renaming) does not need
the `populate` [argument](../rpc/README.md#rpc) since it natively uses selection
fields.

Write commands do not use the `populate` [argument](../rpc/README.md#rpc).
Instead, any models present in either the `data` or `cascade`
[argument](../rpc/README.md#rpc) will be populated in output.

# Modifying nested collections

Clients can modify nested collections by using a nested
[`data`](crud.md) [argument](../rpc/README.md#rpc).

The example below will create both the `user` and its `manager`.

```HTTP
PUT /rest/users/1

{
  "id": "1",
  "name": "Anthony",
  "manager": {
    "id": "3",
    "name": "Anna"
  }
}
```

# Deleting nested collections

To delete nested collections, specify them using the `cascade`
[argument](../rpc/README.md#rpc), as a comma-separated list of nested
collections.

The example below will delete `user`, `user.manager`, `user.manager.friends`
and `user.colleague`.

```HTTP
DELETE /rest/users/1?cascade=manager,manager.friends,colleague
```
