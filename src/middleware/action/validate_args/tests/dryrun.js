'use strict';

const { booleanTest } = require('../../../../fast_validation');

// Validates args.dryrun
const dryrunTests = [
  booleanTest('dryrun'),
];

module.exports = {
  dryrun: dryrunTests,
};
