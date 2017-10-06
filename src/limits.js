'use strict';

const bytes = require('bytes');

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
    // Max size of an attribute's value, in bytes.
    maxAttrValueSize: 2e3,

    // Max URL length
    // Since URL can contain GraphQL query, it should not be less than
    // `maxPayloadSize`
    maxUrlLength: Math.max(maxUrlLength, bytes.parse(maxPayloadSize)),
    // Max level of nesting in query string, e.g. ?var.subvar.subvar2=val
    maxQueryStringDepth: 10,
    // Max length of arrays in query string, e.g. ?var[50]=val
    maxQueryStringLength: 100,

    // How long the request can run, in milliseconds
    requestTimeout: 5e3,
    // When event listeners fail, they are retried with an ever increasing delay
    // This is the upper limit
    // This is 3 minutes, in milliseconds
    maxEventDelay: 18e4,
  };
};

const maxUrlLength = 2000;

module.exports = {
  getLimits,
};
