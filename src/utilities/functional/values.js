'use strict';

const { flatten } = require('./flatten');

// Returns all leaves values (i.e. not objects|arrays) as a list of
// `{ value, key [...] }` pairs
const getValues = function (value, keys = []) {
  if (Array.isArray(value)) {
    const values = value
      .map((valueA, key) => getValues(valueA, [...keys, key]));
    return flatten(values);
  }

  if (value != null && value.constructor === Object) {
    const values = Object.entries(value)
      .map(([key, valueA]) => getValues(valueA, [...keys, key]));
    return flatten(values);
  }

  return [{ value, keys }];
};

module.exports = {
  getValues,
};
