'use strict';

const { cloneDeep } = require('lodash');

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

  const clonedArgs = cloneDeep(args);
  const newInput = addJsl(input, { $ARGS: clonedArgs });
  const nextInput = addLogInfo(newInput, { args: clonedArgs });

  validateArgs({ input });
  nextInput.args = renameArgs({ args });

  const response = await nextFunc(nextInput);
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
