'use strict';

const { mapKeys } = require('../../utilities');
const { throwError } = require('../../error');

// Fill in `mInput.requestheaders` using protocol-specific headers.
// Are set in a protocol-agnostic format, i.e. each protocol sets the same
// object.
// Meant to be used to create (in coming middleware) `mInput.args`,
// but can also be used by rpc layer as is.
const parseHeaders = function ({ specific, protocolHandler }) {
  const requestheaders = protocolHandler.getRequestheaders({ specific });

  if (!requestheaders || requestheaders.constructor !== Object) {
    const message = `'requestheaders' must be an object, not '${requestheaders}'`;
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  // Protocol handler should already normalize header names case,
  // but we do it just in case
  const requestheadersA = mapKeys(
    requestheaders,
    (value, name) => name.toLowerCase(),
  );

  return { requestheaders: requestheadersA };
};

module.exports = {
  parseHeaders,
};
