'use strict';

const { booleanTest } = require('../../../../../fast_validation');

const nextPageTests = [
  booleanTest('has_previous_page'),

  booleanTest('has_next_page'),
];

module.exports = {
  nextPageTests,
};
