# In-memory database

The in-memory database keeps all data in RAM, and optionally persists it on
the file system when the server shuts down. It is meant for development purpose
only.

# Options

The following options are available.

```yml
databases:
  memory:
    data:
      $ref: my_data_file.yml
    save: true
```

The `data` option is an object containing all the collections loaded on server
startup. It defaults to an empty database. For example:

```yml
users:
- id: '1'
  name: Anthony
- id: '2'
  name: David
managers:
...
```

If the `save` option is `true`, the data will be saved back to the file when
the server shuts down, providing the `data` option used a
[JSON reference](json_references.md).
