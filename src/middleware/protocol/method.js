'use strict';

const { throwError } = require('../../error');
const { METHODS } = require('../../constants');

// Fill in `mInput.method`, protocol method, e.g. 'POST'
// Meant to be used by rpc layer.
const parseMethod = function ({ specific, protocolHandler: { getMethod } }) {
  const method = getMethod({ specific });
  validateMethod({ method });
  validateAllowedMethod({ method });

  return { method };
};

const validateMethod = function ({ method }) {
  if (typeof method === 'string') { return; }

  const message = `'method' must be a string, not '${method}'`;
  throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
};

const validateAllowedMethod = function ({ method }) {
  if (METHODS.includes(method)) { return; }

  const message = 'Protocol method is not allowed';
  throwError(message, { reason: 'WRONG_METHOD' });
};

module.exports = {
  parseMethod,
};
