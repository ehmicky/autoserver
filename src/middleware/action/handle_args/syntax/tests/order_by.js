'use strict';

const { stringTest } = require('../../../../../fast_validation');

// Validates args.order_by
const orderByTests = [
  stringTest('order_by'),
];

module.exports = {
  order_by: orderByTests,
};
