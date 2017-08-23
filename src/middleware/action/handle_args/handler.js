'use strict';

const { validateBasic } = require('./validate_basic');
const { validateSyntax } = require('./syntax');
const { validateLimits } = require('./validate_limits');
const { renameArgs } = require('./rename');

// Process client-supplied args: validates them and add them to
// IDL functions variables
// Also rename them camelcase
const handleArgs = function ({ args, action, runOpts, idl }) {
  validateArgs({ args, action, runOpts, idl });

  const argsB = renameArgs({ args });

  return {
    args: argsB,
    ifvParams: { $ARGS: args },
  };
};

const validateArgs = function ({
  args,
  action,
  runOpts: { maxDataLength },
  idl,
}) {
  validateBasic({ args });
  validateSyntax({ args, action, maxDataLength, idl });
  validateLimits({ args, maxDataLength });
};

module.exports = {
  handleArgs,
};
