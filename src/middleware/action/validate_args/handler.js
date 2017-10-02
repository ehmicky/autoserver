'use strict';

const { validateSyntax } = require('./syntax');
const { validateLimits } = require('./validate_limits');

// Validate client-supplied args
const validateArgs = function ({ top: { args, command }, runOpts, idl }) {
  validateSyntax({ args, command, runOpts, idl });
  validateLimits({ args, runOpts });
};

module.exports = {
  validateArgs,
};
