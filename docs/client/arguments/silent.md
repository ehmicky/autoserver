# Silent output

Silent outputs can be requested using the `silent`
[argument](../rpc/README.md#rpc) with any command.

The response will be empty, unless an error occurred. The command will still be
performed.

```HTTP
DELETE /rest/users/1?silent=true
```
