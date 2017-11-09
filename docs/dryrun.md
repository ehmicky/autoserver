# Dry runs

When performing a dry run, no modification will be applied to the
database, but the response (including error responses)
will be the same as if it did.

Every command (except `find`) can perform a dry run by using the `dryrun`
[argument](rpc.md#command-and-arguments), e.g.:

```HTTP
DELETE /rest/users/1?dryrun=true
```
