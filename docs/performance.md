# Performance monitoring

[Events](events.md#types) of type `perf` are related to how
long the server took to perform some steps.
The `startup`, `shutdown` and `request` phases are all monitored.

Each function monitored might be triggered several times for a specific phase.
E.g. the `database query` middleware might be called several times for a single
request. Each call is named a measure.

The event payload contains the following additional properties:
  - `measures` `{object[]}`:
    - `category` `{string}`
    - `label` `{string}`: name
    - `duration` `{number}` - sum of all measures durations, in milliseconds
    - `measures` `{number[]}` - each measure duration, in milliseconds
    - `count` `{number}` - number of measures
    - `average` `{number}` - average measure duration, in milliseconds
  - `measuresmessage` `{string}`: console-friendly table with the same
    information as `measures`

Additionally, a `X-Response-Time: number`
[protocol header](protocols.md#headers-and-method) is sent in the response.
