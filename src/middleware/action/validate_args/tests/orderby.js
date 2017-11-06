'use strict';

const { stringTest } = require('../../../../fast_validation');

// Validates args.orderby
const orderbyTests = [
  stringTest('orderby'),
];

module.exports = {
  orderby: orderbyTests,
};
