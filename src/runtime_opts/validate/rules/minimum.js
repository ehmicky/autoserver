'use strict';

// `validate.minimum` rule
const validateMinimum = function ({ optVal, ruleVal }) {
  if (!Number.isFinite(optVal)) { return; }

  if (optVal < ruleVal) {
    return `must be at least ${ruleVal}`;
  }
};

module.exports = {
  minimum: validateMinimum,
};
