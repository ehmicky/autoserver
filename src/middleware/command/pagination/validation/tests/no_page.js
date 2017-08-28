'use strict';

const { forbiddenTest } = require('../../../../../fast_validation');

const noPageTests = [
  forbiddenTest('page'),
];

module.exports = {
  noPageTests,
};
