'use strict';

const { EngineError } = require('../error');

const throwJslError = function ({ type, message, innererror }) {
  if (type === 'startup') {
    throw new EngineError(message, {
      reason: 'IDL_VALIDATION',
      innererror,
    });
  } else if (type === 'system') {
    throw new EngineError(message, {
      reason: 'UTILITY_ERROR',
      innererror,
    });
  } else if (type === 'filter' || type === 'data') {
    throw new EngineError(message, {
      reason: 'INPUT_VALIDATION',
      innererror,
    });
  } else {
    throw new EngineError(`Wrong type: ${type}`, {
      reason: 'UTILITY_ERROR',
      innererror,
    });
  }
};

module.exports = {
  throwJslError,
};
