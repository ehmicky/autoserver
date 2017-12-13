# Timestamps

The [system plugin](README.md) `timestamp` automatically adds for each
collection the attributes:
  - `created_time` `{datetime}` - set on model's creation
  - `updated_time` `{datetime}` - set on model's modification

It is enabled by default.

```yml
plugins:
- plugin: timestamp
  enabled: false
```
