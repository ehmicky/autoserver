'use strict';

const { throwError } = require('../../../error');

// Check request arguments are not too big
const validateLimits = function ({ data, runOpts: { maxDataLength } }) {
  const isDataTooBig = Array.isArray(data) &&
    data.length > maxDataLength &&
    maxDataLength > 0;

  if (!isDataTooBig) { return; }

  const message = `Argument 'data' must contain at most ${maxDataLength} items`;
  throwError(message, { reason: 'INPUT_LIMIT' });
};

module.exports = {
  validateLimits,
};
