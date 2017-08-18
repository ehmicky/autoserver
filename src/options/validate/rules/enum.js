'use strict';

const { toSentence } = require('underscore.string');

// `validate.enum` rule
const validateEnum = function ({ optVal, ruleVal }) {
  if (!ruleVal.includes(optVal)) {
    return `must be ${toSentence(ruleVal, ', ', ' or ')}`;
  }
};

module.exports = {
  enum: validateEnum,
};
