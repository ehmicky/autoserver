'use strict';

const { throwError } = require('../error');

const throwJslError = function ({ type, message, innererror }) {
  if (type === 'startup') {
    throwError(message, {
      reason: 'IDL_VALIDATION',
      innererror,
    });
  } else if (type === 'system') {
    throwError(message, {
      reason: 'UTILITY_ERROR',
      innererror,
    });
  } else if (type === 'filter' || type === 'data') {
    throwError(message, {
      reason: 'INPUT_VALIDATION',
      innererror,
    });
  } else {
    throwError(`Wrong type: ${type}`, {
      reason: 'UTILITY_ERROR',
      innererror,
    });
  }
};

module.exports = {
  throwJslError,
};
