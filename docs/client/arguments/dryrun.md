# Dry runs

Any [command](../request/crud.md) (except `find`) can perform a dry run by
using the `dryrun` [argument](../rpc/README.md#rpc).

No modification will be applied to the database, but the response (including
error responses) will be the same as if it did.

```HTTP
DELETE /rest/users/1?dryrun=true
```
