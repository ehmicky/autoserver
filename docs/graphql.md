# Client queries

Clients can query the GraphQL server by using the endpoint at
`http://hostname:port/graphql`.

Clients can also perform queries using a web application available at
`http://hostname:port/graphiql`.
They can see the GraphQL schema by clicking on `Documentation explorer`.

Finally, clients can see the GraphQL schema as HTML at
`http://hostname:port/graphql/schema`.

# Read queries

To retrieve a specific model, e.g. `user` use the action `find` followed by
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

To retrieve only one model, use the action `find` followed by the model name
in singular, and specify the model `id`, e.g.:

```graphql
{
  find_user(filter: {id: "1"}) {
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

The difference between singular and plural actions is similar to REST's
`GET /models/id` vs `GET /models`.

# Write queries

The following actions are also available.

`delete` action (similar to REST's `DELETE` method):

```graphql
mutation {
  delete_user(filter: {id: "1"}) {
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

`update` action performs a partial modification (i.e. a patch) (similar to
REST's `PATCH` method):

```graphql
mutation {
  update_user(filter: {id: "1"}, data: {city: "Copenhagen"}) {
    id
    name
  }
}
```

```graphql
mutation {
  update_users(filter: {country: "Denmark"}, data: {city: "Copenhagen"}) {
    id
    name
  }
}
```

`replace` action performs a full modification (similar to REST's `PUT` method):

```graphql
mutation {
  replace_user(data: {id: "1", name: "David"}) {
    id
    name
  }
}
```

```graphql
mutation {
  replace_users(data: [{id: "4", name: "David"}, {id: "5", name: "Alex"}]) {
    id
    name
  }
}
```

`create` action (similar to REST's `POST` method):

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

# Modifying data

One specifies the data to mutate with `data`, which is either an array
(for plural actions) or an object (for singular actions).

It can be used by the following actions: `create`, `replace` and `update`.

`data.id` is required for `replace`, optional for `create`
(it defaults to a UUID) and forbidden for `update`.

`update` action `data` is a bit different, as it is never an array.

# Summary of actions

```graphql
find_model({ filter: { id }, [silent] })
```

```graphql
find_models({ [filter], [order_by], [page_size], [before|after|page],
[silent] })
```

```graphql
delete_model({ filter: { id }, [cascade], [silent], [dryrun] })
```

```graphql
delete_models({ [filter], [cascade], [page_size], [silent], [dryrun] })
```

```graphql
update_model({ data, filter: { id }, [silent], [dryrun] })
```

```graphql
update_models({ data, [filter], [page_size], [silent], [dryrun] })
```

```graphql
create_model({ data, [silent], [dryrun] })
```

```graphql
create_models({ data[], [page_size], [silent], [dryrun] })
```

```graphql
replace_model({ data, [silent], [dryrun] })
```

```graphql
replace_models({ data[], [page_size], [silent], [dryrun] })
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
