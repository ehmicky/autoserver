'use strict';

const parsePreferHeaderLib = require('parse-prefer-header');

const { throwError, addGenErrorHandler } = require('../../../errors');

const {
  getFormat,
  getCharset,
  getCompressResponse,
  getCompressRequest,
} = require('./content_negotiation');
const { getAgnosticMethod } = require('./method');

// Using `X-HTTP-Method-Override` changes the method
const getMethod = function ({ specific: { req: { headers } }, method }) {
  const methodOverride = headers['x-http-method-override'];
  if (!methodOverride) { return; }

  if (method === 'POST') {
    return getAgnosticMethod({ method: methodOverride });
  }

  const message = `The HTTP header 'X-HTTP-Method-Override' must be used with the HTTP method POST, not ${method}`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

// Using `Prefer: return=minimal` request header results in `args.silent` true.
// Same thing for `HEAD` method
const getSilent = function ({ specific, method }) {
  if (method === 'HEAD') { return true; }

  const preferHeader = eParsePreferHeader({ specific });
  const hasMinimalPreference = preferHeader.return === 'minimal';

  if (hasMinimalPreference) { return true; }
};

// Parses Prefer HTTP header
const parsePreferHeader = function ({
  specific: { req: { headers: { prefer } } },
}) {
  if (!prefer) { return {}; }

  return parsePreferHeaderLib(prefer);
};

const eParsePreferHeader = addGenErrorHandler(parsePreferHeader, {
  message: ({ prefer }) =>
    `HTTP 'Prefer' header value syntax error: '${prefer}'`,
  reason: 'INPUT_VALIDATION',
});

// HTTP-specific ways to set input
const input = {
  method: getMethod,
  'topargs.silent': getSilent,
  format: getFormat,
  charset: getCharset,
  compressResponse: getCompressResponse,
  compressRequest: getCompressRequest,
};

module.exports = {
  input,
};
