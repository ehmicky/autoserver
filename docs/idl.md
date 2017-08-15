# IDL file

The IDL file specifies information about the data model and the business logic.

# Configuration

There are several ways to define it, similar to the
[runtime options](runtime.md#configuration).
The first one that is defined will be chosen, from the highest priority
to the lowest:
  - setting an environment variable `API_ENGINE__IDL` containing the path to
    the [configuration file](#configuration-file)
  - using `apiEngine.start({ idl: 'path' })` with a `'path'` to
    the [configuration file](#configuration-file)
  - creating a `api_engine.idl.yml`, `api_engine.idl.yaml` or
    `api_engine.idl.json` file in the current directory, or any parent
    directory. This is the preferred method.

# Configuration file

The format depends on the file extension, and can be either JSON or YAML
(but only with JSON-compatible types).

If a relative file path is used to target the configuration file, it will be
relative to the current directory.

# JSON references

The file can be broken down into several files or use libraries,
by referring to external files (local or HTTP/HTTPS) or Node.js modules, using
[JSON references](https://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03).
Those are simple objects with a single `$ref` property pointing to the file,
e.g.:

```yml
models:
  user:
    $ref: user.yml
```

[JSON references](https://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03)
can also refer to a property in the current file:

```yml
models:
  user:
    $ref: '#/models/old_user'
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

The IDL file can contain the following properties:
  - `engine` `{string}` (required) - file format version.
    Must equal `api-engine 1.0.0`
  - `models` `{object}` (required) - list of [models](models.md#models)
    - `MODEL` `{object}` - MODEL is the name
      - `attributes` `{object}` - list of the model's
        [attributes](models.md#attributes)
        - `ATTRIBUTE` `{object}` - ATTRIBUTE is the name
  - `helpers` `{object}` - [JSL helpers](jsl.md#jsl-helpers)
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
  - [JSL helpers](jsl.md#jsl-helpers)
  - [plugins](plugins.md)

# IDL file validation

The IDL file is validated for syntax errors.

One can add custom properties though by prefixing them with `x-`, at the
top-level, on an model or on an attribute, e.g.:

```yml
models:
  user:
    x-my-custom-prop: 3
```
