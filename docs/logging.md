
  // Customize what is logged as `requestInfo`
  loggerFilter: {
    // Can be a mapping function, or a list of attributes
    payload: ({ id }) => id,
    headers: ['host'],
    // Also available: argData, actionResponses, response, queryVars, params,
    // settings
  },
  // Can customize logging level, among 'info' (default value), 'log', 'warn',
  // 'error' or 'silent'
  loggerLevel: 'info',
  // Used in logs, defaults to hostname
  serverName: 'my-machine',

  // log.PHASE.TYPE.LEVEL
  // Information to send for monitoring
  // Triggered on server startup, shutdowns, requests, errors, logs

// There are different instances of loggers represented by the `phase`:
//  - startup, shutdown: during startup, shutdown
//  - request: one instance is created for each request
//  - process: anything that is process-related, e.g. unhandled rejected
//    promises
// Each instance can fire different types of logs.
//  - message (default): generic message
//  - start: the server is ready
//  - stop: the server has exited
//  - failure: a client-side or server-side error occured
//  - call: a request has completed, i.e. a response was sent back to the
//    client (with success or not)
//  - perf: performance monitoring
// Each log type has an associated `logObj`, i.e. structured log information
// besides the error message and stack trace:
//  - message, start, call: none
//  - failure: `errorInfo`, containing a standard error
//  - stop: `exitStatuses`, showing which server has successfully exited or
//    not, e.g. { HTTP: false, ... }
//  - perf: `measures`, containing performance measurement.
//    `measuresMessage` is also available as a console-friendly string.
// Each log has a level among: info, log, warn, error.
// Each logs fires the server event 'log.PHASE.TYPE.LEVEL' with payload `info`:
//  - timestamp {string}
//  - phase {string} - startup|shutdown|request|process
//  - type {string} - message|start|stop|failure|call|perf
//  - level {string} - info|log|warn|error
//  - message {string} - what's printed on console (see below)
//  - requestInfo {object}
//      - request-specific information
//      - only if the current phase is `request`:
//      - built by calling `log.add(object)`, which is deep merged
//      - is automatically filtered (see `request_info.js` file) to avoid
//        the log to be too big, or leak security information
//  - loggerErrors {string[]} - when logging fails, it is retried with
//    an exponential delay, and this property is set with the error messages.
//  - serverInfo {object} - server or host-specific information
//      - system {object}:
//         - hostname {string}
//         - osType {string} - e.g. 'Linux'
//         - platform {string} - e.g. 'linux'
//         - release {string} - e.g. '4.8.0-52-generic'
//         - arch {string} - e.g. 'x64'
//      - stats {object}
//         - memory {number} - total memory in bytes
//         - cpus {number} - number of CPUs
//         - uptime {number} - how long the server has been running, in secs
//      - node {object}
//         - version {string} - e.g. 'v8.0.0'
//      - apiEngine {object}
//         - version {string} - e.g. '0.0.1'
//      - serverId {UUID} - specific to a given process
//      - serverName {UUID} - specific to a given machine.
//        Uses (if defined) `serverOpts.serverName`
//        or otherwise the system hostname, or empty string if not available.
// A textual summary is also printed on the console:
//  - colorized, unless `node --no-color` or terminal does not support colors
//  - will be filtered according to server option `loggerLevel`:
//    info (default), log, warn, error, silent
//  - console messages are meant as a quick development-time helper.
//    Structured logs, using the server event `log`, are the correct way to
//    store logs for monitoring.
// Note that any exception thrown in this module might not be logged
// (since this is the logger itself), so we must be precautious.

// `requestInfo`:
//   - requestId {string}
//   - timestamp {string}
//   - requestTime {number} - time it took to handle the request, in millisecs.
//     Only defined if the request was successful.
//   - ip {string}
//   - protocol {string} - e.g. HTTP
//   - protocolFullName {string} - e.g. HTTP/1.1
//   - url {string} - full URL
//   - origin {string} - protocol + host + port
//   - path {string} - only the URL path, with no query string nor hash
//   - route {string} - internal route picked according to the URL,
//     among `GraphQL`, `GraphiQL` and `GraphQLPrint`
//   - method {string} - protocol-specific method, e.g. GET
//   - goal {string} - like method, but protocol-agnostic, e.g. `find`
//   - protocolStatus {string} - protocol-specific status, e.g. HTTP status code
//   - status {string} - protocol-agnostic status, among 'INTERNALS', 'SUCCESS',
//     'CLIENT_ERROR' and 'SERVER_ERROR'
//   - pathVars {object} - URL variables, as a hash table
//   - params {object} - Parameters, as a hash table.
//   - settings {object} - Settings, as a hash table.
//   - queryVars {object} - Query variables, as a hash table
//   - headers {object} - protocol headers (e.g. HTTP headers), as a hash table
//   - payload {any} - request payload
//   - operation {string} - operation, among `GraphQL`, `GraphiQL` and
//     `GraphQLPrint`
//   - actions {object} - represented all actions fired
//      - ACTION_PATH {key} - action full path, e.g. 'findModel.findSubmodel'
//         - model {string} - model name
//         - args {object} - action arguments, e.g. filter or sort argument
//         - responses {object[]}
//            - content {object|object[]} - action response (model or
//              collection)
//   - response {object}
//      - content {string} - full response raw content
//      - type {string} - among 'model', 'collection', 'error', 'object',
//        'html', 'text'
//   - phase {string} - 'request', 'startup', 'shutdown' or 'process'
//   - error {string} - error reason
// Each of those fields is optional, i.e. might not be present.
// Remove some properties of log which could be of big size, specifically:
//   - queryVars, headers, params, settings:
//      - apply server option loggerFilter.queryVars|headers|params|settings,
//        which is either a simple mapping function or a list of attribute
//        names.
//        It defaults to returning an empty object.
//   - payload, actions.ACTION_PATH.args.data,
//     actions.ACTION_PATH.responses.content, response.content:
//      - apply server option loggerFilter.payload|argData|actionResponses|
//        response, which is either a simple mapping function or a list of
//        attribute names. It is applied to each model if the value is an array.
//        It defaults to keeping only 'id'.
//      - set JSON size, e.g. `payloadSize`
//        'unknown' if cannot calculate. Not set if value is undefined.
//      - set array length, e.g. `payloadCount` if it is an array.

  // Performance monitoring
