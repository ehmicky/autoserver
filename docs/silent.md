# Silent output

When requesting a silent output:
  - the response's data and metadata will be undefined
  - the action will still be performed
  - if there is any error, the error will still be present in the response

Silent outputs can be requested using the `silent` argument with any action,
e.g.:

```graphql
mutation {
  delete_user(filter: {id: "1"}, silent: true) {
    id
  }
}
```

will respond (if successful) with:

```json
{}
```

Silent outputs can also be requested using:
  - the standard HTTP header `Prefer: return=minimal`
  - the HTTP method `HEAD` instead of `GET`
