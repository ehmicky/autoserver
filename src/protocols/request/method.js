'use strict';

const { throwError } = require('../../errors');
const { METHODS } = require('../constants');

const { validateString } = require('./validate');

const parseMethod = function ({ protocolAdapter: { getMethod }, specific }) {
  if (getMethod === undefined) { return; }

  const method = getMethod({ specific });

  validateString(method, 'method');
  validateMethod({ method });

  return { method };
};

const validateMethod = function ({ method }) {
  if (method === undefined || METHODS.includes(method)) { return; }

  const message = `Protocol method '${method}' is not allowed`;
  throwError(message, { reason: 'METHOD', extra: { allowed: METHODS } });
};

module.exports = {
  parseMethod,
};
