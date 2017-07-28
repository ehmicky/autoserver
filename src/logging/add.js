'use strict';

// Represents a logger
// Can:
//  - createLog({ serverOpts, apiServer, phase }) - returns new `log`
//  - reportLog({ log, level, message, info }) - sends some log
//  - addLog(obj, info) - add requestInfo information.
//    Returns new `obj`, storing info at `obj.log`,
//    i.e. does not modify original `obj`
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

const { deepMerge } = require('../utilities');

const createLog = function ({ serverOpts, apiServer, phase }) {
  const logInfo = {};
  const log = { serverOpts, apiServer, phase, logInfo };
  return log;
};

// Add log information to `obj.log`
// Returns a new copy, i.e. does not modify original `obj`
const addLogInfo = function (obj, newLogInfo) {
  const { log, log: { logInfo } } = obj;
  const nextLogInfo = deepMerge(logInfo, newLogInfo);
  const newLog = Object.assign({}, log, { logInfo: nextLogInfo });
  const newObj = Object.assign({}, obj, { log: newLog });
  return newObj;
};

module.exports = {
  createLog,
  addLogInfo,
};
