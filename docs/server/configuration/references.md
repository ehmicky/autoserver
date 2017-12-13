# References

The [configuration file](configuration.md#configuration-file) can be broken
down into several files by referring to local files with
[references](https://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03).
Those are simple objects with a single `$ref` property pointing to the file.

```yml
collections:
  example_collection:
    $ref: example_collection.yml
```

References are deeply merged with their siblings, which allows you to
extend a configuration from another configuration.

```yml
$ref: base_config.yml
collections: ...
params: ...
```

# Local references

One can refer to a property in the current file by prepending a `#`.

```yml
collections:
  example_collection:
    $ref: '#/collections/old_collection'
```

# Node.js modules

Node.js modules can be imported by appending `.node`.

```yml
params:
  lodash:
    $ref: lodash.node
```
