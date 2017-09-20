# Sorting

One can sort the output of `find`, `update` and `delete` actions,
using `order_by`, e.g.:

```graphql
findUsers(order_by: "name")
```

More complex sorting can be achieved with:

```graphql
findUsers(order_by: "first_name-,last_name")
```

`order_by` defaults to `"id"`.
