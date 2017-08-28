'use strict';

const {
  stringTest,
  integerTest,
} = require('../../../../../fast_validation');

// Validates args.before
const beforeTests = [
  stringTest('before'),
];

// Validates args.after
const afterTests = [
  stringTest('after'),
];

// Validates args.page
const pageTests = [
  integerTest('page'),
];

// Validates args.page_size
const pageSizeTests = [
  integerTest('page_size'),
];

module.exports = {
  before: beforeTests,
  after: afterTests,
  page: pageTests,
  page_size: pageSizeTests,
};
