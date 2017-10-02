# Sorting

One can sort the output of `find` commands, using `order_by`, e.g.:

```graphql
find_users(order_by: "name")
```

`order_by` defaults to `"id"`.

To sort in the opposite order, use `-`, e.g.:

```graphql
find_users(order_by: "name-")
```

To sort according to several attributes, separate them with a comma, e.g.:

```graphql
find_users(order_by: "first_name,last_name")
```
