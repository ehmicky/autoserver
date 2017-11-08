'use strict';

const { stringTest } = require('../../../../fast_validation');

// Validates args.populate
const populateTests = [
  stringTest('populate'),
];

module.exports = {
  populate: populateTests,
};
