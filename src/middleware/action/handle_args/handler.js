'use strict';

const { addIfv } = require('../../../idl_func');
const { addReqInfoIfError } = require('../../../events');

const { validateBasic } = require('./validate_basic');
const { validateSyntax } = require('./syntax');
const { validateLimits } = require('./validate_limits');
const { renameArgs } = require('./rename');

// Process client-supplied args: validates them and add them to
// IDL functions variables
// Also rename them camelcase
const handleArgs = async function (nextFunc, input) {
  const { args } = input;

  const inputA = addIfv(input, { $ARGS: args });

  validateArgs({ input: inputA });

  const argsB = renameArgs({ args });
  const inputB = { ...inputA, args: argsB };

  const response = await nextFunc(inputB);
  return response;
};

const eHandleArgs = addReqInfoIfError(handleArgs, ['args']);

const validateArgs = function ({
  input: { args, action, runOpts: { maxDataLength }, idl },
}) {
  validateBasic({ args });
  validateSyntax({ args, action, maxDataLength, idl });
  validateLimits({ args, maxDataLength });
};

module.exports = {
  handleArgs: eHandleArgs,
};
