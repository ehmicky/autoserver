# Description

Descriptions can be specified for collections under the [schema](schema.md)
property `collection.description` or attributes under `attribute.description`.

Additionally attributes can be documented as deprecated by specifying
`attribute.deprecation_reason`, e.g.:

Also, examples can be documented using `attribute.examples` array of strings,
e.g.:

```yml
collections:
  example_collection:
    attributes:
      name:
        description: Name of a user
        deprecation_reason: Please use the attribute new_name instead
        examples: [John, Mary]
```
