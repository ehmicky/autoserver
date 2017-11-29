# Options

The following limits can be configured with [options](run.md#options):
  - `maxpayload` `{integer|string}` (defaults to `10MB`):
     Max size of request payloads, in bytes.
     Also used as the max URL length.
     Can use 'KB', 'MB', 'GB' OR 'TB'.
  - `defaultpagesize` `{integer}` (defaults to `100`):
    use `0` to disable pagination.
  - `maxpagesize` `{integer}` (defaults to `100`): sets an upper limit to
    client-specified `pagesize`.
  - `maxdatalength` `{integer}` (defaults to `1000`): sets a limit on
    client-specified `data` length, i.e. how many models can be created or
    replaced at once.
    Use `0` to disable.

# System limits

The following limits cannot be configured:
  - maximum number of nested commands: 50
  - maximum length of attributes' value: 2KB
  - maximum number of attributes per model: 50
  - maximum length of model's or attribute's name: 100 characters
  - request timeout: 5 seconds
