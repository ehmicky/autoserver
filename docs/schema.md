# Schema

The schema specifies information about the data collections and the business
logic.

# Configuration

The file is configured using the [`run` option](run.md#options)
`schema`, whose value is the [path](configuration.md#filepaths-options) to the
file.

The file format can be any of the [supported formats](formats.md).

See [here](configuration.md) to learn how to specify `run` options.

By default, files named `apiengine.run.schema.EXTENSION` will be searched in
the current directory, or any parent. `EXTENSION` depends on the file format,
e.g. `yml` for YAML. This is the preferred configuration method.

# JSON references

The file can be broken down into several files by referring to external files
(local or HTTP/HTTPS), using
[JSON references](https://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03).
Those are simple objects with a single `$ref` property pointing to the file,
e.g.:

```yml
collections:
  example_collection:
    $ref: example_collection.yml
```

One can also refer to a property in the current file by prepending a `#`:

```yml
collections:
  example_collection:
    $ref: '#/collections/old_collection'
```

One can also refer to Node.js modules or libraries by appending `.node`:

```yml
variables:
  lodash:
    $ref: lodash.node
```

JSON references are available for any [supported format](formats.md), not only
for JSON.

# Example

```yml
engine: 0
collections:
  companies:
    description: This is a company
    attributes:
      registration_no:
        type: number
  users:
    attributes:
      name:
        description: This is the name of a users
      employer:
        type: companies
```

This file describes two collections:
  - a `companies` collection with attributes `id` (defined by default)
    and `registration_no`
  - a `users` collection with attributes `id`, `name` and `employer`
    (pointing to a `companies` collection)

# Properties

The schema can contain the following properties:
  - `engine` `{string}` (required) - file format version. Must equal `0`
  - `collections` `{object}` (required) - list of
    [collections](collections.md#collections)
    - `COLLECTION` `{object}` - COLLECTION is the name
      - `attributes` `{object}` - list of the collections's
        [attributes](collections.md#attributes)
        - `ATTRIBUTE` `{object}` - ATTRIBUTE is the name
  - `variables` `{object}` - [user variables](functions.md#user-variables)
  - `plugins` `{object}` - [plugins](plugins.md)
  - `validation` `{object}` -
    [custom validation keywords](validation.md#custom-validation)

# Schema validation

The schema is validated for syntax errors.

One can add custom properties though by prefixing them with `__`, at the
top-level, on a collection or on an attribute, e.g.:

```yml
collections:
  example_collection:
    __my_custom_prop: 3
```

# Compilation

It is possible to use the `compile` [instruction](usage.md) in order to
compile the schema. E.g. the following command:

```bash
apiengine compile --schema my_schema.yml
```

will create a compiled version of the schema in the same directory, named
`my_schema.compiled.json`. This file will automatically be loaded instead of
`my_schema.yml` by the `run` command.

The main reason to compile the schema are:
  - speeding up the server startup time
  - validating the schema without having to run the server

The `--schema` option behaves like the same option of the
[`run` instruction](#configuration).
In particular, files named `apiengine.run.schema.EXTENSION` will be searched in
the current directory, or any parent.

See [here](configuration.md) to learn how to specify `compile` options.
