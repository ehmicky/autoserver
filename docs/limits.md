# Options

The following limits can be configured with [options](run.md#options):
  - `maxPayloadSize` `{integer|string}` (defaults to `1MB`):
     Max size of request payloads, in bytes.
     Also used as the max URL length.
     Can use 'KB', 'MB', 'GB' OR 'TB'.
  - `defaultPageSize` `{integer}` (defaults to `100`):
    use `0` to disable pagination.
  - `maxPageSize` `{integer}` (defaults to `100`): sets an upper limit to
    client-specified `pagesize`.
  - `maxDataLength` `{integer}` (defaults to `1000`): sets a limit on
    client-specified `data` length, i.e. how many models can be created or
    replaced at once.
    Use `0` to disable.

# System limits

The following limits cannot be configured:
  - maximum attributes' value: 2KB
  - maximum number of attributes per model: 50
  - maximum model's or attribute's name length: 100 characters
  - request timeout: 5 seconds
