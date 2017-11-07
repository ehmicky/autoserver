# Sorting

One can sort the output of `find` commands, using `order`, e.g.:

```graphql
find_users(order: "name")
```

`order` defaults to `"id"`.

To sort in the opposite order, use `-`, e.g.:

```graphql
find_users(order: "name-")
```

To sort according to several attributes, separate them with a comma, e.g.:

```graphql
find_users(order: "first_name,last_name")
```
