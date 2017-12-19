'use strict';

const { throwError } = require('../../errors');
const { METHODS } = require('../../protocols');

const { validateProtocolString } = require('./validate_parsing');

// Fill in `mInput.method`, protocol method, e.g. 'POST'
// Meant to be used by rpc layer.
const parseMethod = function ({ specific, protocolAdapter: { getMethod } }) {
  if (getMethod === undefined) { return; }

  const method = getMethod({ specific });
  validateProtocolString({ method });
  validateAllowedMethod({ method });

  return { method };
};

const validateAllowedMethod = function ({ method }) {
  if (method === undefined || METHODS.includes(method)) { return; }

  const message = `Protocol method '${method}' is not allowed`;
  throwError(message, { reason: 'WRONG_METHOD', extra: { allowed: METHODS } });
};

module.exports = {
  parseMethod,
};
