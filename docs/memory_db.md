# In-memory database

The in-memory database keeps all data in RAM, and optionally persists it on
the filesystem when the server shuts down. It is meant for development purpose
only.

# Options

The following options are available:

```yml
db:
  memory:
    data: my_data_file.yml
    save: false
```

The `data` option is the path to the file used both for loading the data on
server startup, and saving it on server shutdown.

The file format can be any of the [supported formats](formats.md).

The `data` option defaults to any `apiengine.run.db.memory.EXTENSION` file in
the current directory, or any parent directory. `EXTENSION` depends on the file
format, e.g. `yml` for YAML. If none is found, it will start the server with an
empty database.

If the `save` option is `true` (which is the default), the data will be saved
back to the file when the server shuts down.
