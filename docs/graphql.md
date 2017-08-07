# Client queries

Clients can query the GraphQL server by using the endpoint at
`http://hostname:port/graphql`.

Clients can also perform queries using a web application available at
`http://hostname:port/graphiql`.
They can see the GraphQL schema by clicking on "docs".

Finally, clients can see the GraphQL schema as HTML at
`http://hostname:port/graphql/schema`.

# Read queries

To retrieve a specific model, e.g. `user` use the action `find` followed by
the model name in plural. It is similar to REST's `GET` method.
E.g. the following query:

```graphql
query {
  findUsers {
    id
    name
  }
}
```

Will respond with:

```json
{
  "data": {
    "findUsers": [
      { "id": "1", "name": "Anthony" },
      { "id": "2", "name": "Tom" },
      { "id": "3", "name": "Anna" }
    ]
  }
}
```

To retrieve only one model, use the action `find` followed by the model name
in singular, and specify the model `id`, e.g.:

```graphql
query {
  findUser(filter: {id: "1"}) {
    id
    name
    manager
  }
}
```

Will respond with:

```json
{
  "data": {
    "findUsers": {
      "id": "1",
      "name": "Anthony",
      "manager": "3"
    },
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
  deleteUser(filter: {id: "1"}) {
    id
    name
  }
}
```

```graphql
mutation {
  deleteUsers(filter: {country: "Denmark"}) {
    id
    name
  }
}
```

`update` action performs a partial modification (i.e. a patch) (similar to
REST's `PATCH` method):

```graphql
mutation {
  updateUser(filter: {id: "1"}, data: {city: "Copenhagen"}) {
    id
    name
  }
}
```

```graphql
mutation {
  updateUsers(filter: {country: "Denmark"}, data: {city: "Copenhagen"}) {
    id
    name
  }
}
```

`replace` action performs a full modification (similar to REST's `PUT` method):

```graphql
mutation {
  replaceUser(data: {id: "1", name: "David"}) {
    id
    name
  }
}
```

```graphql
mutation {
  replaceUsers(data: [{id: "4", name: "David"}, {id: "5", name: "Alex"}]) {
    id
    name
  }
}
```

`create` action (similar to REST's `POST` method):

```graphql
mutation {
  createUser(data: {id: "4", name: "David"}) {
    id
    name
  }
}
```

```graphql
mutation {
  createUsers(data: [{id: "4", name: "David"}, {id: "5", name: "Alex"}]) {
    id
    name
  }
}
```

`upsert` action performs a `replace` if the model exists, `create` otherwise.

```graphql
mutation {
  upsertUser(data: {id: "1", name: "David"}) {
    id
    name
  }
}
```

```graphql
mutation {
  upsertUsers(data: [{id: "4", name: "David"}, {id: "5", name: "Alex"}]) {
    id
    name
  }
}
```

# Nested models

One can retrieve nested models, e.g.:

```graphql
query {
  findUser(filter: {id: "1"}) {
    id
    name
    manager
    findManager {
      id
      name
    }
  }
}
```

will respond with:

```json
{
  "data": {
    "findUsers": {
      "id": "1",
      "name": "Anthony",
      "manager": "3",
      "findManager": {
        "id": "3",
        "name": "Anna"
      }
    },
  }
}
```

`user.manager` is an `id` pointing another `user`.

The nested query does not need to specify the manager's `id`,
because it is already available as `user.manager`. However if there were several
managers (i.e. an array of `id`), one could specify which `id`s to retrieve.

Nested queries work otherwise exactly like other queries.


They can be performed both on models (`findManager`) or on collections
(`findManagers`).

They can use any action (including `delete`, `create`, etc.) providing it the
same as the parent action.

They can be infinitely nested.

# Modifying data

One specifies the data to mutate with `data`, which is either an array
(for plural actions) or an object (for singular actions).

It can be used by the following actions: `create`, `replace`, `upsert` and
`update`.

`data.id` is required for `replace` and `upsert`, optional for `create`
(it defaults to a UUID) and forbidden for `update`.

`update` action `data` is a bit different. First, it is never an array.
Second, one can modify models on-the-fly using [JSL](jsl.md).
E.g. to increment a counter by 1:

```graphql
updateUsers(data: {counter: "($ + 1)"})
```

Note that, in the previous example, no modification will be applied on models
where `counter` is not defined.

# Filtering

One can specify which model to target using a `filter`, for the actions
`find`, `delete` and `update`.

`filter.id` is required for singular actions that can use a filter.

Simple filters look like this:

```graphql
deleteUsers(filter: {country: "Denmark"})
```

Filters with custom logic, using [JSL](jsl.md) can also be used:

```graphql
deleteUsers(filter: "($$.country === 'Denmark')")
```

# Sorting

One can sort any plural action, using `order_by`, e.g.:

```graphql
findUsers(order_by: "name")
```

More complex sorting can be achieved with:

```graphql
findUsers(order_by: "first_name-,last_name")
```

# Cursor pagination

Plural actions are paginated by default.

The default pagination system is cursor-based. A plural action will return
batches as:

```json
{
  "data": {
    "findUsers": [
      {
        "id": "1",
        "name": "Anthony",
        "__metadata": {
          "pages": {
            "has_previous_page": false,
            "has_next_page": true,
            "page_size": 10,
            "token": "eyJvIjoid2VpZ2h0LSxpZCIsImYiOiIoKCQkLmlkICE9PSAnMicpICYmICgkJC5mcmllbmRzLmluY2x1ZGVzKCcxJykpKSIsInAiOlszLjUsIjMiXX0"
          }
        }
      },

      ...

      {
        "id": "10",
        "name": "Mary",
        "__metadata": {
          "pages": {
            "has_previous_page": true,
            "has_next_page": true,
            "page_size": 10,
            "token": "eyJvIjoid2VpZ2h0LSxpZCIsImYiOiIoKCQkLmlkICE9PSAnMicpICYmICgkJC5mcmllbmRzLmluY2x1ZGVzKCcxJykpKSIsInAiOlsxLjUsIjEiXX0"
          }
        }
      },
    ]
  }
}
```

The page size is determined by the server, but clients can increase it
(although servers can set a maximum), using:

```graphql
findUsers(page_size: 20)
```

To iterate through batches, take the last model's `token` and repeat the query,
using `after`, e.g.:

```graphql
findUsers(after: "eyJvIjoid2VpZ2h0LSxpZCIsImYiOiIoKCQkLmlkICE9PSAnMicpICYmICgkJC5mcmllbmRzLmluY2x1ZGVzKCcxJykpKSIsInAiOlsxLjUsIjEiXX0")
```

To iterate backward, use `before` instead of `after`, with the first model's
`token`.

Using an empty token `""` with `after` or `before` allows iterating from the
beginning or the end.

The first query (without `before` nor `after`) can specify `filter` or
`order_by`, but the next paginated queries cannot.

One can use `has_previous_page` and `has_next_page` in the response to know
when to stop iterating.

# Offset pagination

One can use an offset-based pagination, by using `page` (starting at 1), e.g.:

```graphql
findUsers(page_size: 20, page: 5)
```

# Summary of actions

```graphql
findOne({ filter: { id } })
```

```graphql
findMany({ [filter], [order_by], [page_size], [before|after|page] })
```

```graphql
deleteOne({ filter: { id } })
```

```graphql
deleteMany({ [filter], [order_by], [page_size] })
```

```graphql
updateOne({ data, filter: { id } })
```

```graphql
updateMany({ data, [filter], [order_by], [page_size] })
```

```graphql
createOne({ data })
```

```graphql
createMany({ data[], [order_by], [page_size] })
```

```graphql
replaceOne({ data })
```

```graphql
replaceMany({ data[], [order_by], [page_size] })
```

```graphql
upsertOne({ data })
```

```graphql
upsertMany({ data[], [order_by], [page_size] })
```

# Error responses

See [here](error.md#error-responses) for information about error responses.
