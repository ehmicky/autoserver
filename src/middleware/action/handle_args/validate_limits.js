'use strict';

const { EngineError } = require('../../../error');

// Check input is not too big
const validateLimits = function ({ args: { data }, maxDataLength }) {
  const isDataTooBig = data instanceof Array &&
    data.length > maxDataLength &&
    maxDataLength > 0;
  if (isDataTooBig) {
    const message = `argument 'data' must contain at most ${maxDataLength} items`;
    throw new EngineError(message, { reason: 'INPUT_LIMIT' });
  }
};

module.exports = {
  validateLimits,
};
