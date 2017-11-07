'use strict';

const { stringTest } = require('../../../../fast_validation');

// Validates args.order
const orderTests = [
  stringTest('order'),
];

module.exports = {
  order: orderTests,
};
