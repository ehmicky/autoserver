'use strict';

const { cloneDeep } = require('lodash');

const { validateBasic } = require('./validate_basic');
const { validateSyntax } = require('./syntax');
const { validateLimits } = require('./validate_limits');
const { renameArgs } = require('./rename');

// Process client-supplied args: validates them and add them to JSL variables
// Also rename them camelcase
const handleArgs = async function (input) {
  const { log, args, jsl, action, serverOpts: { maxDataLength } } = input;

  const clonedArgs = cloneDeep(args);
  const nextInput = jsl.addToInput(input, { $ARGS: clonedArgs });

  validateBasic({ args });

  try {
    validateSyntax({ args, action, maxDataLength });
    validateLimits({ args, maxDataLength });
    nextInput.args = renameArgs({ args });

    const response = await this.next(nextInput);
    return response;
  } catch (error) {
    // Added only for final error handler
    log.add({ args: clonedArgs });

    throw error;
  }
};

module.exports = {
  handleArgs,
};
