# Silent output

When requesting a silent output:
  - the response's data and metadata will be undefined
  - the command will still be performed
  - if there is any error, the error will still be present in the response

Silent outputs can be requested using the `silent` argument with any command,
e.g.:

```graphql
mutation {
  delete_user(id: "1", silent: true) {
    id
  }
}
```

will respond (if successful) with:

```json
{}
```
