'use strict';

const { throwError } = require('../error');

const throwJslError = function ({ type, message, innererror }) {
  const reason = reasons[type];

  if (!reason) {
    throwError(`Wrong type: ${type}`, { reason: 'UTILITY_ERROR', innererror });
  }

  throwError(message, { reason, innererror });
};

const reasons = {
  startup: 'IDL_VALIDATION',
  system: 'UTILITY_ERROR',
  filter: 'INPUT_VALIDATION',
  data: 'INPUT_VALIDATION',
};

module.exports = {
  throwJslError,
};
