'use strict';

const bytes = require('bytes');

// Returns the main numerical limits of the engine.
// Some of those limits cannot be changed by the user.
const getLimits = function ({
  runOpts: {
    pagesize,
    maxpayload = MAX_URL_LENGTH,
  } = {},
} = {}) {
  const maxpayloadA = bytes.parse(maxpayload);

  // `pagesize` `0` disables pagination
  const pagesizeA = pagesize === 0 ? Infinity : pagesize;

  return {
    // Max number of top-level models returned in a response
    // Default: 100
    pagesize: pagesizeA,
    // Max size of request payloads, in bytes.
    // Can use 'KB', 'MB', 'GB' OR 'TB'.
    // Default: '1MB'
    maxpayload: maxpayloadA,
    // Max size of an attribute's value, in bytes.
    maxAttrValueSize: 2e3,

    // Max URL length
    // Since URL can contain GraphQL query, it should not be less than
    // `maxpayload`
    maxUrlLength: Math.max(MAX_URL_LENGTH, maxpayloadA),
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

    // Enforced during schema validation:
    //  - max number of attributes per model: 50
    //  - max model|attribute name length: 200
  };
};

const MAX_URL_LENGTH = 2e3;

module.exports = {
  getLimits,
};
