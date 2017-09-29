'use strict';

const { stringTest } = require('../../../../../fast_validation');

// Validates args.select
const selectTests = [
  stringTest('select'),
];

module.exports = {
  select: selectTests,
};
