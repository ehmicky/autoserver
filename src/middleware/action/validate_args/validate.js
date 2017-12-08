'use strict';

const { fastValidate } = require('../../../fast_validation');

const { validateMultiple } = require('./multiple');
const { commandsTests } = require('./builder');

// Check arguments for client-side errors.
// In a nutshell, checks that:
//  - required arguments are defined
//  - disabled or unknown arguments are not defined
//  - arguments that are defined follow correct syntax
//    Does not check for semantics (e.g. schema validation)
const validateArgs = function ({ top: { args, command }, schema }) {
  validateMultiple({ args, command });

  const tests = commandsTests[command.name];
  fastValidate(
    { prefix: 'Wrong arguments: ', reason: 'INPUT_VALIDATION', tests },
    { ...args, schema },
  );
};

module.exports = {
  validateArgs,
};
