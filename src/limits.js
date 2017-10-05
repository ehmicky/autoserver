'use strict';

// Returns the main numerical limits of the engine.
// Some of those limits cannot be changed by the user.
const getLimits = function ({
  runOpts: {
    maxPageSize,
    maxPayloadSize,
  },
}) {
  return {
    // Max number of top-level models returned in a response
    // Default: 100
    maxPageSize,
    // Max size of request payloads, in bytes.
    // Can use 'KB', 'MB', 'GB' OR 'TB'.
    // Default: '1MB'
    maxPayloadSize,

    // Max level of nesting in query string, e.g. ?var.subvar.subvar2=val
    maxQueryStringDepth: 10,
    // Max length of arrays in query string, e.g. ?var[50]=val
    maxQueryStringLength: 100,

    // How long the request can run, in milliseconds
    requestTimeout: 5000,
  };
};

module.exports = {
  getLimits,
};
