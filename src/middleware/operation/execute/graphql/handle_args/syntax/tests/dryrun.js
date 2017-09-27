'use strict';

const { booleanTest } = require('../../../../../../../fast_validation');

// Validates args.dryrun
const dryRunTests = [
  booleanTest('dryrun'),
];

module.exports = {
  dryrun: dryRunTests,
};
