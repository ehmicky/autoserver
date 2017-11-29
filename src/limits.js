'use strict';

const bytes = require('bytes');

// Returns the main numerical limits of the engine.
// Some of those limits cannot be changed by the user.
const getLimits = function ({
  runOpts: {
    pagesize,
    maxpayload = MAX_URL_LENGTH,
    maxmodels,
  } = {},
} = {}) {
  const maxpayloadA = bytes.parse(maxpayload);

  // `pagesize` `0` disables pagination
  const pagesizeA = pagesize === 0 ? Infinity : pagesize;

  const maxmodelsA = getMaxModels({ maxmodels, pagesize: pagesizeA });

  return {
    // Max number of top-level models returned in a response
    // Default: 100
    pagesize: pagesizeA,
    // Max number of models in either requests (`args.data`) or responses
    // Not used by delete commands
    maxmodels: maxmodelsA,
    // Max number of actions (including top level)
    maxActions: MAX_ACTIONS,
    // Max depth of findMany nested actions
    maxFindManyDepth: MAX_FIND_MANY_DEPTH,
    // Max size of request payloads, in bytes.
    // Can use 'KB', 'MB', 'GB' OR 'TB'.
    // Default: '1MB'
    maxpayload: maxpayloadA,
    // Max size of an attribute's value, in bytes.
    maxAttrValueSize: MAX_ATTR_VALUE_SIZE,

    // Max URL length
    // Since URL can contain GraphQL query, it should not be less than
    // `maxpayload`
    maxUrlLength: Math.max(MAX_URL_LENGTH, maxpayloadA),
    // Max level of nesting in query string, e.g. ?var.subvar.subvar2=val
    maxQueryStringDepth: MAX_QUERY_STRING_DEPTH,
    // Max length of arrays in query string, e.g. ?var[50]=val
    maxQueryStringLength: MAX_QUERY_STRING_LENGTH,

    // How long the request can run, in milliseconds
    requestTimeout: REQUEST_TIMEOUT,
    // When event listeners fail, they are retried with an ever increasing delay
    // This is the upper limit
    // This is 3 minutes, in milliseconds
    maxEventDelay: MAX_EVENT_DELAY,

    // Enforced during schema validation:
    //  - max number of attributes per model: 50
    //  - max model|attribute name length: 200
  };
};

const getMaxModels = function ({ maxmodels, pagesize }) {
  if (maxmodels === undefined && pagesize !== undefined) {
    return pagesize * MAX_MODELS_FACTOR;
  }

  // `maxmodels` `0` disables it
  if (maxmodels === 0) { return Infinity; }

  return maxmodels;
};

const MAX_ACTIONS = 51;

const MAX_MODELS_FACTOR = 1e2;

const MAX_FIND_MANY_DEPTH = 2;

const MAX_ATTR_VALUE_SIZE = 2e3;

const MAX_URL_LENGTH = 2e3;

const MAX_QUERY_STRING_DEPTH = 1e1;

const MAX_QUERY_STRING_LENGTH = 1e2;

const REQUEST_TIMEOUT = 5e3;

const MAX_EVENT_DELAY = 18e4;

module.exports = {
  getLimits,
};
