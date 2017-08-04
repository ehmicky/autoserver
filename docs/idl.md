
The file can be YAML or JSON.

`my_schema.yml` contains:

```yml
version: 1.0.0
models:
  user:
    attributes:
      name: {}
      friends:
        type: user[]
```
