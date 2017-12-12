# Options

The following limits can be configured with the `limits`
[configuration property](configuration.md#properties):
  - `limits.maxpayload` `{integer|string}` (defaults to `10MB`):
     Max size of request payloads, in bytes.
     Also used as the max URL length.
     Can use `KB`, `MB`, `GB` or `TB`.
  - `limits.pagesize` `{integer}` (defaults to `100`):
     see [pagination](pagination.md)
  - `limits.maxmodels` `{integer}` (defaults to `100 * pagesize`, i.e. `10000`):
     see [pagination](pagination.md)

# System limits

The following limits cannot be configured:
  - maximum number of nested commands: `50`
  - maximum length of attributes' value: `2KB`
  - maximum number of attributes per model: `50`
  - maximum length of model's or attribute's name: `100` characters
  - request timeout: `5` seconds
