# Authorization

The possible CRUD commands can be restricted for a given model by specifying
in the [IDL file](idl.md) property `model.commands` among `create`, `read`,
`replace` and `delete`.

`patch` is a combination of both `read` and `replace` permissions, so it does
not need to be specified.

For example, to prevent users from creating users:

```yml
models:
  user:
    commands: [read, replace, delete]
```
