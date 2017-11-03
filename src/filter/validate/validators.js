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

// Validates that if one of the allowed values of an array is among a specific
// set (`ifVals`), it allows all the values from another set (`thenVals`).
// E.g. it does not make sense to forbid $command `patch` while allowing `find`
// and `upsert`, so they must be specified together. I.e. we specify the
// `ruleVal` `[['patch'], ['find', 'upsert']]`
const validateRequires = function ({
  ruleVal,
  validation: { enum: possVals },
  operations,
  throwErr,
}) {
  const enumVals = getEnum({ operations, possVals });

  ruleVal.forEach(([ifVal, thenVal]) =>
    validateRequirePair({ ifVal, thenVal, enumVals, throwErr }));
};

const validateRequirePair = function ({ ifVal, thenVal, enumVals, throwErr }) {
  const missingIfVals = difference(ifVal, enumVals);
  if (missingIfVals.length !== 0) { return; }

  const missingThenVals = difference(thenVal, enumVals);
  if (missingThenVals.length === 0) { return; }

  const ifStr = getWordsList(ifVal, { op: 'and', quotes: true });
  const missingStr = getWordsList(missingThenVals, { op: 'and', quotes: true });
  throwErr(`When specifying ${ifStr}, ${missingStr} must also be specified`);
};

const validators = {
  enum: validateEnum,
  requires: validateRequires,
};

module.exports = {
  validators,
};
