# Data model

The data model is specified using
[configuration properties](../configuration/configuration.md#properties).

This includes the list of [collections](collections.md),
[attributes](collections.md#attributes) and their [relations](relations.md) to
each other.

```yml
collections:
  users:
    description: User of the API
    attributes:
      id:
        type: string
      age:
        type: integer
      reports:
        type: reports[]
  reports:
    attributes:
      id:
        type: string
      content:
        type: string
```

# Data model logic

Logic related to the data model can be specified for each collection and
attribute, including:
  - who is [authorized](authorization.md) to read or write each model
  - [readonly](authorization.md#readonly-attributes) attributes
  - [data validation](validation.md)
  - [default values](default.md)
  - [computing and transforming](transformation.md) attributes
  - [aliasing](compatibility.md) attibute names
  - custom [patch operators](patch.md) to handle model updates

```yml
collections:
  users:
    authorize:
      user_group: admin
    attributes:
      age:
        type: integer
      score:
        type: number
        alias: high_score
        default: 10
        validate:
          minimum: 20
```
