'use strict';

const { objectTest } = require('../../../../../../fast_validation');

// Validates args.params
const paramsTest = [
  objectTest('params'),
];

module.exports = {
  params: paramsTest,
};
