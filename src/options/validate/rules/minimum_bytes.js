'use strict';

const bytes = require('bytes');

// `validate.minimum_bytes` rule
const validateMinimumBytes = function ({ optVal, ruleVal }) {
  const optSize = bytes.parse(optVal);
  const ruleSize = bytes.parse(ruleVal);

  if (optSize !== null && ruleSize !== null && optSize < ruleSize) {
    const ruleSizeStr = bytes.format(ruleSize);
    return `must be at least ${ruleSizeStr}`;
  }
};

module.exports = {
  minimum_bytes: validateMinimumBytes,
};
