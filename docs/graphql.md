# Client queries

Clients can query the GraphQL server by using the endpoint at
`http://hostname:port/graphql`.

Clients can also perform queries using a web application available at
`http://hostname:port/graphiql`.
They can see the GraphQL schema by clicking on `Documentation explorer`.

Finally, clients can see the GraphQL schema as HTML at
`http://hostname:port/graphql/schema`.

# Read queries

To retrieve a specific model, e.g. `user` use the command `find` followed by
the model name in plural. It is similar to REST's `GET` method.
E.g. the following query:

```graphql
{
  find_users {
    id
    name
  }
}
```

will respond with:

```json
{
  "data": [
    { "id": "1", "name": "Anthony" },
    { "id": "2", "name": "Tom" },
    { "id": "3", "name": "Anna" }
  ]
}
```

To retrieve only one model, use the command `find` followed by the model name
in singular, and specify the model `id`, e.g.:

```graphql
{
  find_user(id: "1") {
    id
    name
    manager
  }
}
```

will respond with:

```json
{
  "data": {
    "id": "1",
    "name": "Anthony",
    "manager": "3"
  }
}
```

The difference between singular and plural commands is similar to REST's
`GET /models/id` vs `GET /models`.

# Write queries

The following commands are also available.

`create` command (similar to REST's `POST` method):

```graphql
mutation {
  create_user(data: {id: "4", name: "David"}) {
    id
    name
  }
}
```

```graphql
mutation {
  create_users(data: [{id: "4", name: "David"}, {id: "5", name: "Alex"}]) {
    id
    name
  }
}
```

`upsert` command performs a full modification (similar to REST's `PUT` method):

```graphql
mutation {
  upsert_user(data: {id: "1", name: "David"}) {
    id
    name
  }
}
```

```graphql
mutation {
  upsert_users(data: [{id: "4", name: "David"}, {id: "5", name: "Alex"}]) {
    id
    name
  }
}
```

`patch` command performs a partial modification (i.e. a patch) (similar to
REST's `PATCH` method):

```graphql
mutation {
  patch_user(id: "1", data: {city: "Copenhagen"}) {
    id
    name
  }
}
```

```graphql
mutation {
  patch_users(filter: {country: "Denmark"}, data: {city: "Copenhagen"}) {
    id
    name
  }
}
```

`delete` command (similar to REST's `DELETE` method):

```graphql
mutation {
  delete_user(id: "1") {
    id
    name
  }
}
```

```graphql
mutation {
  delete_users(filter: {country: "Denmark"}) {
    id
    name
  }
}
```

# Modifying data

One specifies the data to mutate with the `data` argument, which is either an
array (for plural commands) or an object (for singular commands).

It can be used by the following commands: `create`, `upsert` and `patch`.

`data.id` is required for `upsert`, optional for `create`
(it defaults to a UUID) and forbidden for `patch`.

The `data` argument for the `patch` command is a bit different, as it is never
an array.

# Summary of commands

```graphql
find_model({ id, [silent] })
```

```graphql
find_models({ [filter], [orderby], [pagesize], [before|after|page],
[silent] })
```

```graphql
create_model({ data, [silent], [dryrun] })
```

```graphql
create_models({ data[], [pagesize], [silent], [dryrun] })
```

```graphql
upsert_model({ data, [silent], [dryrun] })
```

```graphql
upsert_models({ data[], [pagesize], [silent], [dryrun] })
```

```graphql
patch_model({ data, id, [silent], [dryrun] })
```

```graphql
patch_models({ data, [filter], [pagesize], [silent], [dryrun] })
```

```graphql
delete_model({ id, [cascade], [silent], [dryrun] })
```

```graphql
delete_models({ [filter], [cascade], [pagesize], [silent], [dryrun] })
```

# Error responses

See [here](error.md#error-responses) for information about error responses.

# More information

See the following documentation to learn more about:
  - [nested models](relations.md)
  - [selecting](selecting.md)
  - [filtering](filtering.md)
  - [sorting](sorting.md)
  - [pagination](pagination.md)
  - [dry runs](dryrun.md)
  - [silent outputs](silent.md)
  - [limits](limits.md)
