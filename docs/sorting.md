# Sorting

One can sort any plural action, using `order_by`, e.g.:

```graphql
findUsers(order_by: "name")
```

More complex sorting can be achieved with:

```graphql
findUsers(order_by: "first_name-,last_name")
```

`order_by` defaults to `"id"`.
