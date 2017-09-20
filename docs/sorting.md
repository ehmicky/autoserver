# Sorting

One can sort the output of `find`, `update` and `delete` actions,
using `order_by`, e.g.:

```graphql
find_users(order_by: "name")
```

More complex sorting can be achieved with:

```graphql
find_users(order_by: "first_name-,last_name")
```

`order_by` defaults to `"id"`.
