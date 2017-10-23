# GraphQL

GraphQL natively handles selections.

But if you want to select all attributes instead of specifying each one,
use the special attribute `'all'`, e.g.:

```graphql
{
  find_user(id: "1") {
    all
  }
}
```

instead of:

```graphql
{
  find_user(id: "1") {
    id
    name
    manager
  }
}
```
