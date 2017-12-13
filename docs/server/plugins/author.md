# Model authors

The [system plugin](README.md) `author` automatically adds for each collection
the attributes:
  - `created_by` `{user}` - set on model's creation
  - `updated_by` `{user}` - set on model's modification

It is not enabled by default.

The following plugin options must be specified:
  - `currentuser` [`{function}`](../configuration/functions.md): retrieves the
    current request's user. Cannot return null if the user is anonymous.
  - `collection` `{string}`: user's collection name.

```yml
plugins:
- plugin: author
  opts:
    currentuser:
      $ref: get_user.js
    collection: users
```
