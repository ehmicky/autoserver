'use strict';

const { addIfv } = require('../../../idl_func');
const { addReqInfo } = require('../../../events');

const { validateBasic } = require('./validate_basic');
const { validateSyntax } = require('./syntax');
const { validateLimits } = require('./validate_limits');
const { renameArgs } = require('./rename');

// Process client-supplied args: validates them and add them to
// IDL functions variables
// Also rename them camelcase
const handleArgs = function (input) {
  const { args } = input;

  const inputA = addIfv(input, { $ARGS: args });
  const inputB = addReqInfo(inputA, { args });

  validateArgs({ input: inputB });

  const argsB = renameArgs({ args });
  const inputC = { ...inputB, args: argsB };

  return inputC;
};

const validateArgs = function ({
  input: { args, action, runOpts: { maxDataLength }, idl },
}) {
  validateBasic({ args });
  validateSyntax({ args, action, maxDataLength, idl });
  validateLimits({ args, maxDataLength });
};

module.exports = {
  handleArgs,
};
