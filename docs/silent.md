# Silent output

When requesting a silent output, the response will be empty, unless an error
occurred. The command will still be performed.

Silent outputs can be requested using the `silent` [argument](rpc.md#rpc) with
any command.

```HTTP
DELETE /rest/users/1?silent=true
```
