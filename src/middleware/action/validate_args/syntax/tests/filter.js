'use strict';

const {
  objectTest,
  objectOrArrayTest,
  unknownTest,
} = require('../../../../../fast_validation');

const filterIdTest = {
  test ({ filter: { id } }) {
    if (typeof id === 'string') { return true; }

    return id &&
      id.constructor === Object &&
      Object.keys(id).length === 1 &&
      typeof id.eq === 'string';
  },
  message: '\'filter.id\' must be a string or an object containing a single \'eq\' operator',
  argName: 'filter.id',
};

// Validates args.filter for single commands
const singleFilterTests = [
  { ...objectTest('filter'), argName: 'filter' },
  filterIdTest,
  { ...unknownTest('filter', ['id']), argName: 'filter' },
];

// Validates args.filter for multiple commands
const multipleFilterTests = [
  { ...objectOrArrayTest('filter'), argName: 'filter' },
];

module.exports = {
  multiple_filter: multipleFilterTests,
  single_filter: singleFilterTests,
};
