'use strict';

const { getTopLevelAction } = require('../utilities');

const { validateBasic } = require('./validate_basic');
const { validateSyntax } = require('./syntax');
const { validateLimits } = require('./validate_limits');
const { renameArgs } = require('./rename');

// Process client-supplied args: validates them and add them to
// IDL functions variables
// Also rename them camelcase
const handleArgs = function ({ actions, runOpts, idl }) {
  const action = getTopLevelAction({ actions });
  const args = handleTopLevelArgs({ action, runOpts, idl });
  const actionsA = actions
    .map(actionB => (actionB === action ? { ...actionB, args } : actionB));
  return actionsA;
};

const handleTopLevelArgs = function ({
  action: { args, actionConstant: { name: actionName } },
  runOpts,
  idl,
}) {
  validateBasic({ args });
  validateSyntax({ args, actionName, runOpts, idl });
  validateLimits({ args, runOpts });

  const argsA = renameArgs({ args });

  return argsA;
};

module.exports = {
  handleArgs,
};
