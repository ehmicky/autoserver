# IDL file

The IDL file contains information about the data model and the business logic.
It is the main configuration file.

# Minimalistic example

```yml
engine: api-engine 1.0.0
models:
  user: {}
```

# Format

The file can be written in either YAML or JSON. YAML files can only contain
JSON-compatible types.

External files (local or remote) or Node.js modules can be included by using
[JSON references](https://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03),
e.g.:

```yml
models:
  user:
    $ref: user.yml
```

# IDL file validation

The IDL file is validated for syntax errors.

One can add custom properties though by prefixing them with `x-`, at the
top-level, on an model or on an attribute, e.g.:

```yml
models:
  user:
    x-my-custom-prop: 3
```

# Properties

The IDL file can contain the following properties:
  - `engine` `{string}` (required) - file format version.
    Must equal `api-engine 1.0.0`
  - `models` `{object}` - list of [models](models.md#models)
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
