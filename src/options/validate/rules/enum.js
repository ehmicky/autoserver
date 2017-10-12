'use strict';

const { getWordsList } = require('../../../utilities');

// `validate.enum` rule
const validateEnum = function ({ optVal, ruleVal }) {
  if (!ruleVal.includes(optVal)) {
    return `must be ${getWordsList(ruleVal, { json: true })}`;
  }
};

module.exports = {
  enum: validateEnum,
};
