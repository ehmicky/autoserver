'use strict';

const { throwError } = require('../../error');

// Fill in `input.headers` using protocol-specific headers.
// Are set in a protocol-agnostic format, i.e. each protocol sets the same
// object.
// Meant to be used to create (in coming middleware) `input.settings` and
// `input.params`, but can also be used by operation layer as is.
const parseHeaders = function ({ specific, protocolHandler }) {
  const headers = getHeaders({ specific, protocolHandler });

  return { headers, reqInfo: { headers } };
};

const getHeaders = function ({ specific, protocolHandler }) {
  const headers = protocolHandler.parseHeaders({ specific });

  if (!headers || headers.constructor !== Object) {
    const message = `'headers' must be an object, not '${headers}'`;
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  return headers;
};

module.exports = {
  parseHeaders,
};
