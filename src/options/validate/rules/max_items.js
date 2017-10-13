'use strict';

const pluralize = require('pluralize');

// `validate.max_items` rule
const validateMaxItems = function ({ optVal, ruleVal }) {
  if (!Array.isArray(optVal)) { return; }

  if (optVal.length > ruleVal) {
    return `must contain at most ${ruleVal} ${pluralize('items', ruleVal)}`;
  }
};

module.exports = {
  max_items: validateMaxItems,
};
