'use strict';

const parsePreferHeaderLib = require('parse-prefer-header');

const { addGenErrorHandler } = require('../../../error');

// Returns a request's HTTP headers, normalized lowercase
const getRequestHeaders = function ({ specific: { req: { headers = {} } } }) {
  return headers;
};

// Returns a response's HTTP headers, normalized lowercase
const getResponseHeaders = function ({ specific: { res } }) {
  const responseHeaders = res.getHeaders();
  // Otherwise `responseHeaders.constructor` is not `Object`
  return { ...responseHeaders };
};

// Parses Prefer HTTP header
const parsePreferHeader = function ({ requestHeaders: { prefer } }) {
  if (!prefer) { return {}; }

  return parsePreferHeaderLib(prefer);
};

const eParsePreferHeader = addGenErrorHandler(parsePreferHeader, {
  message: ({ prefer }) =>
    `HTTP 'Prefer' header value syntax error: '${prefer}'`,
  reason: 'INPUT_VALIDATION',
});

// Set HTTP header, ready to be sent with response
const setResponseHeaders = function ({ specific, responseHeaders = {} }) {
  return Object.entries(responseHeaders).reduce(
    (specificA, [name, value]) =>
      setResponseHeader({ specific: specificA, name, value }),
    specific,
  );
};

const setResponseHeader = function ({
  specific,
  specific: { res },
  name,
  value,
}) {
  res.setHeader(name, value);
  return specific;
};

module.exports = {
  getRequestHeaders,
  getResponseHeaders,
  parsePreferHeader: eParsePreferHeader,
  setResponseHeaders,
};
