'use strict';

const { stringTest } = require('../../../../fast_validation');

// Validates args.cascade
const cascadeTests = [
  stringTest('cascade'),
];

module.exports = {
  cascade: cascadeTests,
};
