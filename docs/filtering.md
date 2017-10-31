# Simple filtering

One can specify which models to target using an `id` or a `filter`,
for the commands `find`, `delete` and `patch`.

If the command is singular, the `id` argument should be used, e.g.:

```graphql
find_user(id: "1")
```

If the command is plural, the `filter` argument should be used, e.g.:

```graphql
find_users(filter: {country: "Denmark"})
```

`filter` can be an array if you want to specify alternatives ("or"), e.g.:

```graphql
delete_users(filter: [{country: "Denmark"}, {country: "Germany"}])
```

# Advanced filtering

The following operators can be used for more complex operations:
  - `eq`: equals to
  - `neq`: does not equal to
  - `lt`: less than
  - `lte`: less than, or equals to
  - `gt`: greater than
  - `gte`: greater than, or equals to
  - `in`: is among
  - `nin`: is not among

The following operators use regular expressions, and are only available for
string attributes:
  - `like`: matches regular expression (case insensitive)
  - `nlike`: does not match regular expression (case insensitive)

Array attributes can only use the following operators.
They take another filter object as input, which is applied on each element of
the array:
  - `all`: all elements match the filter
  - `some`: at least some elements match the filter

# Examples

The following two examples are the same:

```graphql
find_users(filter: {country: "Denmark"})
```

```graphql
find_users(filter: {country: {eq: "Denmark"}})
```

Searching for users whose age is under 30:

```graphql
find_users(filter: {age: {lt: 30}})
```

Searching for users from either Denmark or Germany:

```graphql
find_users(filter: {country: {in: ["Denmark", "Germany"]}})
```

Searching for users whose name starts with `B`:

```graphql
find_users(filter: {name: {like: "^B"}})
```

Searching for users with at least one grade above 5:

```graphql
find_users(filter: {grades: {some: {gt: 5}}})
```

Searching for users with no grade above 5:

```graphql
find_users(filter: {grades: {all: {le: 5}}})
```
