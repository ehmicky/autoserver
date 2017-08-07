'use strict';

const { transtype, mapValues, mapKeys } = require('../../../utilities');

// Normalize params|settings
const transformValues = function ({ values }) {
  const valuesA = mapValues(values, value => transtype(value));
  const valuesB = mapKeys(valuesA, (value, name) => name.toLowerCase());
  return valuesB;
};

module.exports = {
  transformValues,
};
