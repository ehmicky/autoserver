'use strict';

const { throwError } = require('../../../error');

// Check request arguments are not too big
const validateLimits = function ({ data, runOpts: { maxdatalength } }) {
  const isDataTooBig = Array.isArray(data) &&
    data.length > maxdatalength &&
    maxdatalength > 0;

  if (!isDataTooBig) { return; }

  const message = `Argument 'data' must contain at most ${maxdatalength} items`;
  throwError(message, { reason: 'INPUT_LIMIT' });
};

module.exports = {
  validateLimits,
};
