'use strict';

// `validate.maximum` rule
const validateMaximum = function ({ optVal, ruleVal }) {
  if (!Number.isFinite(optVal)) { return; }

  if (optVal > ruleVal) {
    return `must be at most ${ruleVal}`;
  }
};

module.exports = {
  maximum: validateMaximum,
};
