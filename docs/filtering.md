# Filtering

One can specify which model to target using a `filter`, for the commands
`find`, `delete` and `patch`.

`filter.id` is required for singular commands that can use a filter.

Filters look like this:

```graphql
find_users(filter: {country: "Denmark"})
```

Arrays can be used for "or" alternatives, e.g.:

```graphql
delete_users(filter: [{country: "Denmark"}, {country: "Germany"}])
```

or:

```graphql
delete_users(filter: {country: ["Denmark", "Germany"]})
```

Operators can be used for more complex operations

```graphql
delete_users(filter: {age: { lt: 30 }})
```

The following operators are available:
  - `eq`: equal to
  - `ne`: not equal to
  - `lt`: less than
  - `le`: less than, or equal to
  - `gt`: greater than
  - `ge`: greater than, or equal to
