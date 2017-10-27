'use strict';

const { getWordsList } = require('../../utilities');

const validateEnum = function ({ type, value, ruleVal, throwErr }) {
  if (!ALLOWED_OPERATORS.includes(type)) {
    const message = `must use operator ${getWordsList(ALLOWED_OPERATORS, { quotes: true })}`;
    throwErr(message);
  }

  if (!ruleVal.includes(value)) {
    const message = `must be ${getWordsList(ruleVal, { json: true })}`;
    throwErr(message);
  }
};

const ALLOWED_OPERATORS = ['eq', 'neq', 'in', 'nin'];

const validators = {
  enum: validateEnum,
};

module.exports = {
  validators,
};
