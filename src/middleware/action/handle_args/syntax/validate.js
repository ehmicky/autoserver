'use strict';

const { fastValidate } = require('../../../../fast_validation');

const { actionsTests } = require('./builder');

// Check arguments, for client-side errors.
// In a nutshell, checks that:
//  - required arguments are defined
//  - disabled or unknown arguments are not defined
//  - arguments that are defined follow correct syntax
//    Does not check for semantics (e.g. IDL validation)
const validateSyntax = function ({ args, action, runOpts }) {
  const tests = actionsTests[action.name];
  fastValidate({
    prefix: 'Wrong arguments: ',
    reason: 'INPUT_VALIDATION',
    tests,
  }, {
    ...args,
    runOpts,
  });
};

module.exports = {
  validateSyntax,
};
