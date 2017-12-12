# Simple filtering

One can specify which models to target using a `filter` for the commands
`find`, `delete` and `patch`.

The `filter` [argument](client/syntax/rpc.md#rpc) can target any attribute.

```HTTP
GET /rest/users/?filter.country=Denmark
```

# Alternatives

`filter` can be an array if you want to specify alternatives ("or").

```HTTP
GET /rest/users/?filter.0.country=Denmark&filter.1.country=Germany
```

or using a JSON array:

```HTTP
GET /rest/users/?filter=[{"country":"Denmark"},{"country":"Germany"}]
```

which, after URI encoding is:

```HTTP
GET /rest/users/?filter=%5B%7B%22country%22%3A%22Denmark%22%7D%2C%7B%22country%22%3A%22Germany%22%7D%5D
```

# `id` argument

The `id` [argument](client/syntax/rpc.md#rpc) is similar to
`filter: { id: "ID" }`, except:
  - the response will be a model instead of an array of models
  - [pagination](client/arguments/pagination.md) and [sorting](client/arguments/sorting.md) cannot
    be used, i.e. the following [arguments](client/syntax/rpc.md#rpc) are not
    available: `pagesize`, `page`, `before`, `after`, `order`

```HTTP
GET /rest/users/1
```

# Advanced filtering

The following operators can be used for advanced filtering:
  - `_eq`: equals to
  - `_neq`: does not equal to
  - `_lt`: less than
  - `_lte`: less than, or equals to
  - `_gt`: greater than
  - `_gte`: greater than, or equals to
  - `_in`: is among
  - `_nin`: is not among
  - `_like`: matches regular expression (case insensitive)
  - `_nlike`: does not match regular expression (case insensitive)
  - `_all`: all elements match the filter
  - `_some`: at least some elements match the filter

`_like` and `_nlike` use regular expressions, and are only available for
string attributes.

`_all` and `_some` are only available for array attributes, and array attributes
can only use those operators. They take another filter object as input, which
is applied on each element of the array.

# Cross-attributes filtering

It is possible to compare two attributes by using the `model.ATTRIBUTE`
notation.

```HTTP
GET /rest/users/?filter.created_time=model.updated_time
```

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
