'use strict';

const parsePreferHeaderLib = require('parse-prefer-header');

const { addGenErrorHandler } = require('../../../error');

// Returns a request's HTTP headers, normalized lowercase
const getRequestheaders = function ({ specific: { req: { headers = {} } } }) {
  return headers;
};

// Returns a response's HTTP headers, normalized lowercase
const getResponseheaders = function ({ specific: { res } }) {
  const responseheaders = res.getHeaders();
  // Otherwise `responseheaders.constructor` is not `Object`
  return { ...responseheaders };
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

// Set HTTP header, ready to be sent with response
const setResponseheaders = function ({ specific, responseheaders = {} }) {
  return Object.entries(responseheaders).reduce(
    (specificA, [name, value]) =>
      setResponseheader({ specific: specificA, name, value }),
    specific,
  );
};

const setResponseheader = function ({
  specific,
  specific: { res },
  name,
  value,
}) {
  res.setHeader(name, value);
  return specific;
};

module.exports = {
  getRequestheaders,
  getResponseheaders,
  parsePreferHeader: eParsePreferHeader,
  setResponseheaders,
};
