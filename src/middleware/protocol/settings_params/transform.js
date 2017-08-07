'use strict';

const { transtype, mapValues, mapKeys } = require('../../../utilities');

// Normalize params|settings
const transformValues = function ({ values }) {
  // Transform e.g. ?settings.mysettings to ?settings.mysettings=true
  const valuesA = mapValues(values, value => (value == null ? true : value));
  // Transform e.g. 'Number' to actual number
  const valuesB = mapValues(valuesA, value => transtype(value));
  // Case-insensitive
  const valuesC = mapKeys(valuesB, (value, name) => name.toLowerCase());
  return valuesC;
};

module.exports = {
  transformValues,
};
