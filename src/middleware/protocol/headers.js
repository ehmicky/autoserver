'use strict';

const { throwError } = require('../../error');

// Fill in `mInput.headers` using protocol-specific headers.
// Are set in a protocol-agnostic format, i.e. each protocol sets the same
// object.
// Meant to be used to create (in coming middleware) `mInput.args`,
// but can also be used by rpc layer as is.
const parseHeaders = function ({ specific, protocolHandler }) {
  const headers = protocolHandler.getHeaders({ specific });

  if (!headers || headers.constructor !== Object) {
    const message = `'headers' must be an object, not '${headers}'`;
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  // Client parameters can be specified in protocol headers
  const { params } = headers;

  return { headers, topargs: { params } };
};

module.exports = {
  parseHeaders,
};
