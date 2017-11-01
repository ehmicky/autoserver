'use strict';

const { validateSyntax } = require('./syntax');
const { validateLimits } = require('./validate_limits');

// Validate client-supplied args
const validateArgs = function ({ top: { args, command }, runOpts, schema }) {
  validateSyntax({ args, command, runOpts, schema });
  validateLimits({ args, runOpts });
};

module.exports = {
  validateArgs,
};
