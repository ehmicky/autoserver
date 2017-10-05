# Options

The following limits can be configured with [options](run.md#options):
  - `maxPayloadSize` `{integer|string}` (defaults to `1MB`):
     Max size of request payloads, in bytes.
     Can use 'KB', 'MB', 'GB' OR 'TB'.
  - `defaultPageSize` `{integer}` (defaults to `100`):
    use `0` to disable pagination.
  - `maxPageSize` `{integer}` (defaults to `100`): sets an upper limit to
    client-specified `page_size`.
  - `maxDataLength` `{integer}` (defaults to `1000`): sets a limit on
    client-specified `data` length, i.e. how many models can be created or
    replaced at once.
    Use `0` to disable.
