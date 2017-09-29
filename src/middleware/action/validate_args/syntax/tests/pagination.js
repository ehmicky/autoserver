'use strict';

const {
  stringTest,
  integerTest,
  gtTest,
  leTest,
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

  gtTest('page', 0),
];

// Validates args.page_size
const pageSizeTests = [
  integerTest('page_size'),

  gtTest('page_size', 0),

  leTest('page_size', ({ runOpts: { maxPageSize } }) => maxPageSize),
];

module.exports = {
  before: beforeTests,
  after: afterTests,
  page: pageTests,
  page_size: pageSizeTests,
};
