'use strict';

const { throwError } = require('../../error');
const { METHODS } = require('../../constants');

// Fill in:
//  - `mInput.method`: protocol-agnostic method, e.g. 'create'
// Meant to be used by rpc layer.
const parseMethod = function ({ specific, protocolHandler }) {
  const method = protocolHandler.getMethod({ specific });

  if (!METHODS.includes(method)) {
    const message = 'Protocol method is not allowed';
    throwError(message, { reason: 'WRONG_METHOD' });
  }

  return { method };
};

module.exports = {
  parseMethod,
};
