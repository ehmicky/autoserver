# Schema

The schema specifies information about the data model and the business logic.

# Configuration

The file is configured using the [`run` option](run.md#options)
`schema`, whose value is the [path](configuration.md#filepaths-options) to a
JSON or YAML file (but only with JSON-compatible types).

See [here](configuration.md) to learn how to specify `run` options.

By default, files named `api_engine.run.schema.json`, `api_engine.run.schema.yml`
or `api_engine.run.schema.yaml` will be searched in the current directory, or
any parent. This is the preferred configuration method.

# JSON references

The file can be broken down into several files by referring to external files
(local or HTTP/HTTPS), using
[JSON references](https://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03).
Those are simple objects with a single `$ref` property pointing to the file,
e.g.:

```yml
models:
  example_model:
    $ref: example_model.yml
```

One can also refer to a property in the current file by prepending a `#`:

```yml
models:
  example_model:
    $ref: '#/models/old_model'
```

One can also refer to Node.js modules or libraries by appending `.node`:

```yml
variables:
  lodash:
    $ref: lodash.node
```

# Example

```yml
engine: api-engine 1.0.0
models:
  company:
    description: This is a company
    attributes:
      registration_no:
        type: number
  user:
    attributes:
      name:
        description: This is the name of a user
      employer:
        type: company
```

This file describes two models:
  - a `company` model with attributes `id` (defined by default)
    and `registration_no`
  - a `user` model with attributes `id`, `name` and `employer`
    (pointing to a `company` model)

# Properties

The schema can contain the following properties:
  - `engine` `{string}` (required) - file format version.
    Must equal `api-engine 1.0.0`
  - `models` `{object}` (required) - list of [models](models.md#models)
    - `MODEL` `{object}` - MODEL is the name
      - `attributes` `{object}` - list of the model's
        [attributes](models.md#attributes)
        - `ATTRIBUTE` `{object}` - ATTRIBUTE is the name
  - `variables` `{object}` - [user variables](functions.md#user-variables)
  - `plugins` `{object}` - [plugins](plugins.md)
  - `validation` `{object}` -
    [custom validation keywords](validation.md#custom-validation)

See the following documentation for:
  - [models and attributes](models.md)
  - [data validation](validation.md)
  - [auto-documentation](autodocumentation.md)
  - [authorization](authorization.md)
  - [transformation](transformation.md)
  - [compatibility](compatibility.md)
  - [custom logic](functions.md)
  - [plugins](plugins.md)

# Schema validation

The schema is validated for syntax errors.

One can add custom properties though by prefixing them with `x-`, at the
top-level, on an model or on an attribute, e.g.:

```yml
models:
  example_model:
    x-my-custom-prop: 3
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
In particular, files named `api_engine.run.schema.json`, `api_engine.run.schema.yml`
or `api_engine.run.schema.yaml` will be searched in the current directory, or
any parent.

See [here](configuration.md) to learn how to specify `compile` options.
