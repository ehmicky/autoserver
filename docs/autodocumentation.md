# Description

Descriptions can be specified for models under the [schema](schema.md)
property `model.description` or attributes under `attribute.description`.

Additionally attributes can be documented as deprecated by specifying
`attribute.deprecation_reason`, e.g.:

Also, examples can be documented using `attribute.examples` array of strings,
e.g.:

```yml
name:
  description: Name of a user
  deprecation_reason: Please use the attribute new_name instead
  examples: [John, Mary]
```

They will be used e.g. in GraphQL schema.
