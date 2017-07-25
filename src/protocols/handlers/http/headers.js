'use strict';

const parsePreferHeaderLib = require('parse-prefer-header');

const { throwError } = require('../../../error');

// Returns a request's HTTP headers, normalized lowercase
const parseHeaders = function ({ specific: { req: { headers = {} } } }) {
  return headers;
};

// Parses Prefer HTTP header
const parsePreferHeader = function ({ headers: { prefer } }) {
  if (!prefer) { return {}; }

  try {
    return parsePreferHeaderLib(prefer);
  } catch (error) {
    const message = `HTTP 'Prefer' header value syntax error: '${prefer}'`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }
};

// Set HTTP header, ready to be sent with response
const sendHeaders = function ({ specific: { res }, headers = {} }) {
  for (const [name, value] of Object.entries(headers)) {
    res.setHeader(name, value);
  }
};

module.exports = {
  parseHeaders,
  parsePreferHeader,
  sendHeaders,
};
