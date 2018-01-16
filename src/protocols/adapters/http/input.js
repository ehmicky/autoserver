'use strict';

const parsePreferHeaderLib = require('parse-prefer-header');

const { mapValues, omitBy } = require('../../../utilities');
const { throwError, addGenErrorHandler } = require('../../../errors');

const {
  getFormat,
  getCharset,
  getCompressResponse,
  getCompressRequest,
} = require('./content_negotiation');
const { getAgnosticMethod } = require('./method');

// HTTP-specific ways to set input
const mapInput = function (methods, ...args) {
  const input = mapValues(methods, func => func(...args));
  const inputA = omitBy(input, value => value === undefined);
  return inputA;
};

// Using `X-HTTP-Method-Override` changes the method
const getMethod = function ({ specific: { req: { headers } }, method }) {
  const methodOverride = headers['x-http-method-override'];
  if (!methodOverride) { return; }

  if (method === 'POST') {
    return getAgnosticMethod({ method: methodOverride });
  }

  const message = `The HTTP header 'X-HTTP-Method-Override' must be used with the HTTP method POST, not ${method}`;
  throwError(message, { reason: 'VALIDATION' });
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
  reason: 'VALIDATION',
});

const TOPARGS_INPUT = {
  silent: getSilent,
};
const getTopargs = mapInput.bind(null, TOPARGS_INPUT);

const INPUT = {
  method: getMethod,
  topargs: getTopargs,
  format: getFormat,
  charset: getCharset,
  compressResponse: getCompressResponse,
  compressRequest: getCompressRequest,
};
const getInput = mapInput.bind(null, INPUT);

module.exports = {
  getInput,
};
