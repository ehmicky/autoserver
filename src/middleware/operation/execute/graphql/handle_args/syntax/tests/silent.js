'use strict';

const { booleanTest } = require('../../../../../../../fast_validation');

// Validates args.silent
const silentTests = [
  booleanTest('silent'),
];

module.exports = {
  silent: silentTests,
};
