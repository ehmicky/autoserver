# Silent output

When requesting a silent output, the response will be empty, unless an error
occurred. The command will still be performed.

Silent outputs can be requested using the `silent`
[argument](rpc.md#command-and-arguments) with any command,
e.g.:

```graphql
mutation {
  delete_user(id: "1", silent: true) {
    id
  }
}
```
