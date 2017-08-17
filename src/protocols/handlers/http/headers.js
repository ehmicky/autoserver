'use strict';

const parsePreferHeaderLib = require('parse-prefer-header');

const { addErrorHandler } = require('../../../error');

// Returns a request's HTTP headers, normalized lowercase
const parseHeaders = function ({ specific: { req: { headers = {} } } }) {
  return headers;
};

// Parses Prefer HTTP header
const parsePreferHeader = function ({ headers: { prefer } }) {
  if (!prefer) { return {}; }

  return parsePreferHeaderLib(prefer);
};

const eParsePreferHeader = addErrorHandler(parsePreferHeader, {
  message: ({ prefer }) =>
    `HTTP 'Prefer' header value syntax error: '${prefer}'`,
  reason: 'INPUT_VALIDATION',
});

// Set HTTP header, ready to be sent with response
const sendHeaders = function ({ specific, headers = {} }) {
  return Object.entries(headers).reduce(
    (specificA, [name, value]) =>
      sendHeader({ specific: specificA, name, value }),
    specific,
  );
};

const sendHeader = function ({ specific, specific: { res }, name, value }) {
  res.setHeader(name, value);
  return specific;
};

module.exports = {
  parseHeaders,
  parsePreferHeader: eParsePreferHeader,
  sendHeaders,
};
