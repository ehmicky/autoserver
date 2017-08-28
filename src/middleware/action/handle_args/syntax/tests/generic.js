'use strict';

// Tests applied to all actions
const genericTests = [
  {
    test (args) {
      return !args || args.constructor !== Object;
    },
    message: '\'arguments\' must be an object',
  },
];

module.exports = {
  genericTests,
};
