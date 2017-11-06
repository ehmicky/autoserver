'use strict';

const { difference, intersection } = require('../utilities');

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

module.exports = {
  getEnum,
};
