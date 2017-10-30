'use strict';

const { throwError } = require('../../error');

// Fill in `mInput.requestHeaders` using protocol-specific headers.
// Are set in a protocol-agnostic format, i.e. each protocol sets the same
// object.
// Meant to be used to create (in coming middleware) `mInput.args`,
// but can also be used by operation layer as is.
const parseHeaders = function ({ specific, protocolHandler }) {
  const requestHeaders = protocolHandler.getRequestHeaders({ specific });

  if (!requestHeaders || requestHeaders.constructor !== Object) {
    const message = `'requestHeaders' must be an object, not '${requestHeaders}'`;
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  return { requestHeaders };
};

module.exports = {
  parseHeaders,
};
