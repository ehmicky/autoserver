# Sorting

One can sort the output of `find` commands, using `orderby`, e.g.:

```graphql
find_users(orderby: "name")
```

`orderby` defaults to `"id"`.

To sort in the opposite order, use `-`, e.g.:

```graphql
find_users(orderby: "name-")
```

To sort according to several attributes, separate them with a comma, e.g.:

```graphql
find_users(orderby: "first_name,last_name")
```
