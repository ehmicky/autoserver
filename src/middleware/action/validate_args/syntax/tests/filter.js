'use strict';

const {
  objectTest,
  objectOrArrayTest,
  stringTest,
  unknownTest,
} = require('../../../../../fast_validation');

// Validates args.filter for single commands
const singleFilterTests = [
  { ...objectTest('filter'), argName: 'filter' },
  { ...stringTest('filter.id'), argName: 'filter.id' },
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
