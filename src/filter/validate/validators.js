'use strict';

const { getWordsList, difference } = require('../../utilities');
const { getEnum } = require('../enum');

// Validate value is among set of values
const validateEnum = function ({ type, value, ruleVal, throwErr }) {
  if (!ENUM_OPERATORS.includes(type)) {
    const message = `must use operator ${getWordsList(ENUM_OPERATORS, { quotes: true })}`;
    throwErr(message);
  }

  if (Array.isArray(value)) {
    return value
      .forEach(val => validateEnumVal({ ruleVal, value: val, throwErr }));
  }

  validateEnumVal({ ruleVal, value, throwErr });
};

const ENUM_OPERATORS = ['eq', 'neq', 'in', 'nin'];

const validateEnumVal = function ({ ruleVal, value, throwErr }) {
  if (!ruleVal.includes(value)) {
    const message = `must be ${getWordsList(ruleVal, { json: true })}`;
    throwErr(message);
  }
};

// Validate value if any given set of values is given, others are given as well
const validateEquivalent = function ({
  ruleVal,
  validation: { enum: possVals },
  operations,
  throwErr,
}) {
  const enumVals = getEnum({ operations, possVals });
  const equivalents = ruleVal
    .find(vals => isEquivalent({ vals, enumVals }));
  if (equivalents === undefined) { return; }

  const missing = ruleVal
    .find(vals => !isEquivalent({ vals, enumVals }));
  if (missing === undefined) { return; }

  const equivalentsStr = getWordsList(equivalents, { op: 'and', quotes: true });
  const missingStr = getWordsList(missing, { op: 'and', quotes: true });
  throwErr(`When specifying ${equivalentsStr}, ${missingStr} must also be specified, because they are equivalent`);
};

const isEquivalent = function ({ vals, enumVals }) {
  return difference(vals, enumVals).length === 0;
};

const validators = {
  enum: validateEnum,
  equivalent: validateEquivalent,
};

module.exports = {
  validators,
};
