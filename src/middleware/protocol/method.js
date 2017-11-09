'use strict';

const { throwError } = require('../../error');
const { METHODS } = require('../../constants');

// Fill in:
//  - `mInput.method`: protocol method, e.g. 'POST'
// Meant to be used by rpc layer.
const parseMethod = function ({ specific, protocolHandler }) {
  const method = protocolHandler.getMethod({ specific });

  validateMethod({ method });

  return { method };
};

const validateMethod = function ({ method }) {
  if (METHODS.includes(method)) { return; }

  const message = 'Protocol method is not allowed';
  throwError(message, { reason: 'WRONG_METHOD' });
};

module.exports = {
  parseMethod,
};
