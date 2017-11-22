'use strict';

const { getWordsList, difference, intersection } = require('../../utilities');
const { ENUM_OPERATORS } = require('../operators');

// Validate value is among set of values
const validateEnum = function ({ type, value, ruleVal, throwErr }) {
  if (!ENUM_OPERATORS.includes(type)) {
    const operators = getWordsList(ENUM_OPERATORS, { quotes: true });
    const message = `must use operator ${operators}`;
    throwErr(message);
  }

  if (Array.isArray(value)) {
    return value
      .forEach(val => validateEnumVal({ ruleVal, value: val, throwErr }));
  }

  validateEnumVal({ ruleVal, value, throwErr });
};

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

// For operations allowing only `_eq`, `_in`, `_nin`, `_neq`, normalize to `_in`
// values, using the set of possible values.
const getEnum = function ({ operations, possVals }) {
  const values = operations
    .map(({ type, value }) => enumOperations[type]({ value, possVals }));
  const valuesA = intersection(possVals, ...values);
  return valuesA;
};

const enumOperations = {
  _in: ({ value }) => value,
  _eq: ({ value }) => [value],
  _nin: ({ value, possVals }) => difference(possVals, value),
  _neq: ({ value, possVals }) => difference(possVals, [value]),
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
