'use strict';

const { getWordsList } = require('../../utilities');

const validateEnum = function ({ value, ruleVal, throwErr }) {
  if (ruleVal.includes(value)) { return; }

  const message = `must be ${getWordsList(ruleVal, { json: true })}`;
  throwErr(message);
};

const validators = {
  enum: validateEnum,
};

module.exports = {
  validators,
};
