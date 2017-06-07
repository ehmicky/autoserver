'use strict';


const { isEqual } = require('lodash');

const { validate } = require('../../../validation');
const { commands } = require('../../../constants');
const { EngineError } = require('../../../error');


/**
 * Command-related validation layer
 * Check input, for the errors that should not happen,
 * i.e. server-side (e.g. 500)
 **/
const commandValidation = function ({ idl: { models } = {} }) {
  return async function commandValidation(input) {
    const { command, log } = input;
    const perf = log.perf.start('commandValidation', 'middleware');

    const schema = getValidateServerSchema({ models });
    validate({ schema, data: input, reportInfo });

    validateCommand({ command });

    perf.stop();
    const response = await this.next(input);
    return response;
  };
};

const reportInfo = { type: 'serverInputSyntax', dataVar: 'input' };

// Get JSON schema to validate against input
const getValidateServerSchema = function ({ models = {} }) {
  const modelNames = Object.keys(models);

  return {
    required: [
      'modelName',
      'args',
      'sysArgs',
      'command',
      'jsl',
      'params',
    ],
    properties: {
      modelName: {
        type: 'string',
        minLength: 1,
        enum: modelNames,
      },
      args: { type: 'object' },
      sysArgs: {
        type: 'object',
        // We want to make sure action layer knows whether pagination
        // will be applied or not
        required: ['pagination'],
        properties: {
          pagination: {
            type: 'boolean',
          },
          authorization: {
            type: 'boolean',
          },
        },
      },
      command: { type: 'object' },
      jsl: { type: 'object' },
      params: { type: 'object' },
    },
  };
};

// Validate that command is among the possible ones
const validateCommand = function ({ command }) {
  const isValid = commands.some(possibleCommand => {
    return isEqual(possibleCommand, command);
  });
  if (!isValid) {
    const message = `Invalid command: ${JSON.stringify(command)}`;
    throw new EngineError(message, { reason: 'INPUT_SERVER_VALIDATION' });
  }
};


module.exports = {
  commandValidation,
};
