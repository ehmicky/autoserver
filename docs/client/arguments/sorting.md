# Sorting

One can sort the output of `find` commands, using `order`.

```HTTP
GET /rest/users/?order=name
```

`order` defaults to `id`.

To sort in the opposite order, append `-` to the attribute.

```HTTP
GET /rest/users/?order=name-
```

To sort according to several attributes, separate them with a comma.

```HTTP
GET /rest/users/?order=first_name,last_name
```
