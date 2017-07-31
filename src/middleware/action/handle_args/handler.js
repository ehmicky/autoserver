'use strict';

const { addJsl } = require('../../../jsl');
const { addLogInfo } = require('../../../logging');

const { validateBasic } = require('./validate_basic');
const { validateSyntax } = require('./syntax');
const { validateLimits } = require('./validate_limits');
const { renameArgs } = require('./rename');

// Process client-supplied args: validates them and add them to JSL variables
// Also rename them camelcase
const handleArgs = async function (nextFunc, input) {
  const { args } = input;

  const inputA = addJsl(input, { $ARGS: args });
  const inputB = addLogInfo(inputA, { args });

  validateArgs({ input });

  const argsB = renameArgs({ args });
  const inputC = { ...inputB, args: argsB };

  const response = await nextFunc(inputC);
  return response;
};

const validateArgs = function ({
  input: { args, action, serverOpts: { maxDataLength } },
}) {
  validateBasic({ args });
  validateSyntax({ args, action, maxDataLength });
  validateLimits({ args, maxDataLength });
};

module.exports = {
  handleArgs,
};
