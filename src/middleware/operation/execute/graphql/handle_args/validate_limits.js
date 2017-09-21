'use strict';

const { throwError } = require('../../../../../error');

// Check request arguments are not too big
const validateLimits = function ({
  args: { data },
  runOpts: { maxDataLength },
}) {
  const isDataTooBig = Array.isArray(data) &&
    data.length > maxDataLength &&
    maxDataLength > 0;

  if (isDataTooBig) {
    const message = `argument 'data' must contain at most ${maxDataLength} items`;
    throwError(message, { reason: 'INPUT_LIMIT' });
  }
};

module.exports = {
  validateLimits,
};
