# In-memory database

The in-memory database keeps all data in RAM, and optionally persists it on
the filesystem when the server shuts down. It is meant for development purpose
only.

The following options are available:

```yml
db:
  memory:
    data: my_data_file.json
    save: false
```

It supports all the model [`kind`s](databases.md#model-kinds).

# Data

The `data` option is the path to the file used both for loading the data on
server startup, and saving it on server shutdown.

The file format can be YAML or JSON.

The `data` option defaults to any `api_engine.run.db.memory.yml`,
`api_engine.run.db.memory.yaml` or `api_engine.run.db.memory.json` file in the
current directory, or any parent directory. It none is found, it will start
the server with an empty database.

If the `save` option is `true` (which is the default), the data will be saved
back to the file when the server shuts down.
