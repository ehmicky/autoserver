# Simple filtering

One can specify which models to target using a `filter` for the commands
`find`, `delete` and `patch`.

The `filter` [argument](rpc.md#command-and-arguments) can target any attribute,
e.g.:

```HTTP
GET /rest/users/?filter.country=Denmark
```

`filter` can be an array if you want to specify alternatives ("or"), e.g.:

```HTTP
GET /rest/users/?filter.0.country=Denmark&filter.1.country=Germany
```

With GraphQL, this would look like:

```graphql
{
  find_users(filter: [{ country: "Denmark" }, { country: "Germany "}]) {
    id
    name
    manager
  }
}
```

# id argument

The `id` [argument](rpc.md#command-and-arguments) is similar to
`filter: { id: "ID" }`, except the response will be an object instead of an
array of objects, e.g.:

```HTTP
GET /rest/users/1
```

# Advanced filtering

The following operators can be used for more complex filtering:
  - `_eq`: equals to
  - `_neq`: does not equal to
  - `_lt`: less than
  - `_lte`: less than, or equals to
  - `_gt`: greater than
  - `_gte`: greater than, or equals to
  - `_in`: is among
  - `_nin`: is not among

The following operators use regular expressions, and are only available for
string attributes:
  - `_like`: matches regular expression (case insensitive)
  - `_nlike`: does not match regular expression (case insensitive)

Array attributes can only use the following operators.
They take another filter object as input, which is applied on each element of
the array:
  - `_all`: all elements match the filter
  - `_some`: at least some elements match the filter

# Examples

The following two examples are the same:

```HTTP
GET /rest/users/?filter.country=Denmark
```

```HTTP
GET /rest/users/?filter.country._eq=Denmark
```

Searching for users whose age is under 30:

```HTTP
GET /rest/users/?filter.age._lt=30
```

Searching for users from either Denmark or Germany:

```HTTP
GET /rest/users/?filter.country._in=["Denmark","Germany"]
```

which, after URI encoding is:

```HTTP
GET /rest/users/?filter.country._in=%5B%22Denmark%22,%22Germany%22%5D
```

Searching for users whose name starts with `B` (the regular expression must
also be URI encoded):

```HTTP
GET /rest/users/?filter.name._like=^B
```

Searching for users with at least one grade above 5:

```HTTP
GET /rest/users/?filter.grades._some._gt=5
```

Searching for users with no grade above 5:

```HTTP
GET /rest/users/?filter.grades._all._lte=5
```
