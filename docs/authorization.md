# Authorization

The possible CRUD commands can be restricted for a given model by specifying
in the [IDL file](idl.md) property `model.commands` among `create`, `read`,
`update` and `delete`.

One can also restrict a command to its singular version. E.g. when specifying
`createOne`, clients will be able to create that model, but only one model at a
time.

For example, to prevent users from creating users, or deleting several at once:

```yml
models:
  user:
    commands: [read, update, deleteOne]
```
