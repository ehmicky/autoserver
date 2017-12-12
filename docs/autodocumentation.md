# Description

Descriptions can be specified with the `collection.description` and
`attribute.description` [configuration properties](configuration.md#properties).

Additionally attributes can be documented as deprecated by specifying
`attribute.deprecation_reason`.

Also, examples can be documented using `attribute.examples` array of strings.

```yml
collections:
  example_collection:
    description: Description of this collection
    attributes:
      name:
        description: Name of a user
        deprecation_reason: Please use the attribute new_name instead
        examples: [John, Mary]
```
