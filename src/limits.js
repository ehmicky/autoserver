'use strict';

const bytes = require('bytes');

// Returns the main numerical limits of the engine.
// Some of those limits cannot be changed by the user.
const getLimits = function ({ config } = {}) {
  const configLimits = getConfigLimits({ config });

  return {
    ...SYSTEM_LIMITS,
    ...configLimits,
  };
};

// Limits that can be changed in `config.limits`
const getConfigLimits = function ({ config }) {
  if (config === undefined) { return; }

  const { limits } = config;

  const pagesize = getPagesize({ limits });
  const maxpayload = getMaxpayload({ limits });
  const maxmodels = getMaxmodels({ limits, pagesize });

  return {
    // Max number of top-level models returned in a response
    // Default: 100
    pagesize,
    // Max number of models in either requests (`args.data`) or responses
    // Not used by delete commands
    maxmodels,
    // Max size of request payloads, in bytes.
    // Can use 'KB', 'MB', 'GB' OR 'TB'.
    // Default: '1MB'
    maxpayload,
    // Max URL length
    // Since URL can contain GraphQL query, it should not be less than
    // `maxpayload`
    maxUrlLength: Math.max(MAX_URL_LENGTH, maxpayload),
  };
};

const getPagesize = function ({ limits: { pagesize } }) {
  // `pagesize` `0` disables pagination
  if (pagesize === 0) { return Infinity; }

  return pagesize;
};

const getMaxpayload = function ({ limits: { maxpayload } }) {
  return bytes.parse(maxpayload);
};

const getMaxmodels = function ({ limits: { maxmodels }, pagesize }) {
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

const MIN_MAXPAYLOAD = 1e2;

const REQUEST_TIMEOUT = 5e3;

// Limits that cannot be changed in `config.limits`
const SYSTEM_LIMITS = {
  // Max number of actions (including top level)
  maxActions: MAX_ACTIONS,
  // Max depth of findMany nested actions
  maxFindManyDepth: MAX_FIND_MANY_DEPTH,
  // Max size of an attribute's value, in bytes.
  maxAttrValueSize: MAX_ATTR_VALUE_SIZE,

  // Minimum value for maxpayload
  minMaxpayload: MIN_MAXPAYLOAD,
  // Max level of nesting in query string, e.g. ?var.subvar.subvar2=val
  maxQueryStringDepth: MAX_QUERY_STRING_DEPTH,
  // Max length of arrays in query string, e.g. ?var[50]=val
  maxQueryStringLength: MAX_QUERY_STRING_LENGTH,

  // How long the request can run, in milliseconds
  requestTimeout: REQUEST_TIMEOUT,

  // Enforced during config validation:
  //  - max number of attributes per model: 50
  //  - max model|attribute name length: 200
};

module.exports = {
  getLimits,
};
