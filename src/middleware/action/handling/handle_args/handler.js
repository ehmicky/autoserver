'use strict';

const { validateBasic } = require('./validate_basic');
const { validateSyntax } = require('./syntax');
const { validateLimits } = require('./validate_limits');
const { renameArgs } = require('./rename');

// Process client-supplied args: validates them and add them to
// IDL functions variables
// Also rename them camelcase
const handleArgs = function ({ actions, top, runOpts, idl }) {
  validateArgs({ top, runOpts, idl });

  const actionsA = actions.map(renameArgs);
  return actionsA;
};

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
  handleArgs,
};
