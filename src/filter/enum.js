'use strict';

const { difference, intersection } = require('../utilities');

// For operations allowing only `eq`, `in`, `nin`, `neq`, normalize to `in`
// values, using the set of possible values.
const getEnum = function ({ operations, possVals }) {
  const values = operations
    .map(({ type, value }) => enumOperations[type]({ value, possVals }));
  const valuesA = intersection(possVals, ...values);
  return valuesA;
};

const enumOperations = {
  in: ({ value }) => value,
  eq: ({ value }) => [value],
  nin: ({ value, possVals }) => difference(possVals, value),
  neq: ({ value, possVals }) => difference(possVals, [value]),
};

module.exports = {
  getEnum,
};
