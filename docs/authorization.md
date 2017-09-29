# Authorization

The possible CRUD commands can be restricted for a given model by specifying
in the [IDL file](idl.md) property `model.commands` among `create`, `read`,
`replace` and `delete`.

For example, to prevent users from creating users:

```yml
models:
  user:
    commands: [read, replace, delete]
```
