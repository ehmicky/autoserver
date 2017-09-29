'use strict';

const {
  objectTest,
  objectArrayTest,
} = require('../../../../../fast_validation');

// Validates single args.data
const singleDataTests = [
  { ...objectTest('data'), argName: 'data' },
];

// Validates multiple args.data
const multipleDataTests = [
  { ...objectArrayTest('data'), argName: 'data' },
];

module.exports = {
  single_data: singleDataTests,
  multiple_data: multipleDataTests,
};
