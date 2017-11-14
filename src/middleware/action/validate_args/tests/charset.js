'use strict';

const { stringTest } = require('../../../../fast_validation');

// Validates args.charset
const charsetTests = [
  stringTest('charset'),
];

module.exports = {
  charset: charsetTests,
};
