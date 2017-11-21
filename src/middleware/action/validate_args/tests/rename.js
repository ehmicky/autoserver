'use strict';

const { stringTest } = require('../../../../fast_validation');

// Validates args.rename
const renameTests = [
  stringTest('rename'),
];

module.exports = {
  rename: renameTests,
};
