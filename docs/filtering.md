# Simple filtering

One can specify which models to target using an `id` or a `filter`,
for the commands `find`, `delete` and `patch`.

If the command is singular, the `id`
[argument](operations.md#command-and-arguments) should be used, e.g.:

```graphql
find_user(id: "1")
```

If the command is plural, the `filter`
[argument](operations.md#command-and-arguments) should be used, e.g.:

```graphql
find_users(filter: {country: "Denmark"})
```

`filter` can be an array if you want to specify alternatives ("or"), e.g.:

```graphql
delete_users(filter: [{country: "Denmark"}, {country: "Germany"}])
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

```graphql
find_users(filter: {country: "Denmark"})
```

```graphql
find_users(filter: {country: {_eq: "Denmark"}})
```

Searching for users whose age is under 30:

```graphql
find_users(filter: {age: {_lt: 30}})
```

Searching for users from either Denmark or Germany:

```graphql
find_users(filter: {country: {_in: ["Denmark", "Germany"]}})
```

Searching for users whose name starts with `B`:

```graphql
find_users(filter: {name: {_like: "^B"}})
```

Searching for users with at least one grade above 5:

```graphql
find_users(filter: {grades: {_some: {_gt: 5}}})
```

Searching for users with no grade above 5:

```graphql
find_users(filter: {grades: {_all: {_lte: 5}}})
```
