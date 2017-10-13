'use strict';

const pluralize = require('pluralize');

// `validate.min_items` rule
const validateMinItems = function ({ optVal, ruleVal }) {
  if (!Array.isArray(optVal)) { return; }

  if (optVal.length < ruleVal) {
    return `must contain at least ${ruleVal} ${pluralize('items', ruleVal)}`;
  }
};

module.exports = {
  min_items: validateMinItems,
};
