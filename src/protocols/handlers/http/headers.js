'use strict';

const parsePreferHeaderLib = require('parse-prefer-header');

const { addGenErrorHandler } = require('../../../error');

// Returns a request's HTTP headers, normalized lowercase
const getRequestheaders = function ({ specific: { req: { headers = {} } } }) {
  return headers;
};

// Parses Prefer HTTP header
const parsePreferHeader = function ({ requestheaders: { prefer } }) {
  if (!prefer) { return {}; }

  return parsePreferHeaderLib(prefer);
};

const eParsePreferHeader = addGenErrorHandler(parsePreferHeader, {
  message: ({ prefer }) =>
    `HTTP 'Prefer' header value syntax error: '${prefer}'`,
  reason: 'INPUT_VALIDATION',
});

module.exports = {
  getRequestheaders,
  parsePreferHeader: eParsePreferHeader,
};
