# Readonly attributes

Readonly attributes can only be modified when the model is created.
Trying to modify them will not do anything, but won't report any error.
They can be specified using `attribute.readonly`, e.g.:

```yml
weight:
  readonly: true
```
