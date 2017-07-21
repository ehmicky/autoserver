'use strict';

const { cloneDeep } = require('lodash');

const { EngineError } = require('../../../error');

const { validateSyntax } = require('./syntax');
const { validateLimits } = require('./validate_limits');
const { renameArgs } = require('./rename');

// Process client-supplied args: validates them and add them to JSL variables
// Also rename them camelcase
const handleArgs = async function (input) {
  const { log, args, jsl, action, serverOpts: { maxDataLength } } = input;

  if (!args || args.constructor !== Object) {
    const message = `Invalid 'args': '${args}'`;
    throw new EngineError(message, { reason: 'INPUT_SERVER_VALIDATION' });
  }

  const clonedArgs = cloneDeep(args);

  try {
    const nextInput = jsl.addToInput(input, { $ARGS: clonedArgs });

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
