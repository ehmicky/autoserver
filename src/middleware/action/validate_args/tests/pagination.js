'use strict';

const {
  stringTest,
  integerTest,
  gtTest,
  leTest,
} = require('../../../../fast_validation');
const { getLimits } = require('../../../../limits');

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

// Validates args.pagesize
const pagesizeTests = [
  integerTest('pagesize'),

  gtTest('pagesize', 0),

  leTest('pagesize', ({ runOpts }) => getLimits({ runOpts }).maxpagesize),
];

module.exports = {
  before: beforeTests,
  after: afterTests,
  page: pageTests,
  pagesize: pagesizeTests,
};
