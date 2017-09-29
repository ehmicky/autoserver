'use strict';

const { validateBasic } = require('./validate_basic');
const { validateSyntax } = require('./syntax');
const { validateLimits } = require('./validate_limits');

// Process client-supplied args: validates them and add them to
// IDL functions variables
const validateArgs = function ({
  top: { args, actionConstant: { name: actionName } },
  runOpts,
  idl,
}) {
  validateBasic({ args });
  validateSyntax({ args, actionName, runOpts, idl });
  validateLimits({ args, runOpts });
};

module.exports = {
  validateArgs,
};
