'use strict';

const { pickBy, mapKeys, mapValues, transtype } = require('../../../utilities');

// Returns a request's application-specific HTTP headers, normalized lowercase.
// At the moment, only keeps X-Apiengine-Params header
const getHeaders = function ({ specific: { req: { headers } } }) {
  const headersA = pickBy(
    headers,
    (value, name) => HEADER_NAMES.includes(name)
  );
  const headersB = mapKeys(
    headersA,
    (value, name) => name.replace(ARGS_REGEXP, '$2'),
  );
  const headersC = mapValues(headersB, transtype);
  return headersC;
};

// Whitelisted headers
const HEADER_NAMES = [
  'x-apiengine-params',
];

// Remove prefix
const ARGS_REGEXP = /^(x-apiengine-)(.+)$/;

module.exports = {
  getHeaders,
};
