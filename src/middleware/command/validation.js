'use strict';


const { isEqual } = require('lodash');

const { validate } = require('../../validation');
const { COMMANDS } = require('../../constants');
const { EngineError } = require('../../error');


/**
 * Command-related validation layer
 * Check input, for the errors that should not happen,
 * i.e. server-side (e.g. 500)
 **/
const commandValidation = function ({ idl: { models } = {} }) {
  return async function commandValidation(input) {
    const { command, log, args: { newData, currentData } } = input;
    const perf = log.perf.start('command.validation', 'middleware');

    const schema = getValidateServerSchema({ models });
    validate({ schema, data: input, reportInfo });

    validateCommand({ command });
    validateCurrentData({ newData, currentData });

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
      'command',
      'jsl',
      'params',
      'settings',
    ],
    properties: {
      modelName: {
        type: 'string',
        minLength: 1,
        enum: modelNames,
      },
      args: {
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
          currentData: {
            oneOf: [
              { type: 'object' },
              { type: 'array', items: { type: 'object' } },
            ],
          },
        },
      },
      command: { type: 'object' },
      jsl: { type: 'object' },
      params: { type: 'object' },
      settings: { type: 'object' },
    },
  };
};

// Validate that command is among the possible ones
const validateCommand = function ({ command }) {
  const isValid = COMMANDS.some(possibleCommand => {
    return isEqual(possibleCommand, command);
  });
  if (!isValid) {
    const message = `Invalid command: ${JSON.stringify(command)}`;
    throw new EngineError(message, { reason: 'INPUT_SERVER_VALIDATION' });
  }
};

// Validate that `args.currentData` reflects `args.newData`
const validateCurrentData = function ({ newData, currentData }) {
  if (!currentData) { return; }

  const differentTypes =
    (newData instanceof Array && !(currentData instanceof Array)) ||
    (!(newData instanceof Array) && currentData instanceof Array) ||
    (!newData && currentData);
  if (differentTypes) {
    const message = `'args.currentData' is invalid: ${JSON.stringify(currentData)}`;
    throw new EngineError(message, { reason: 'INPUT_SERVER_VALIDATION' });
  }

  if (newData instanceof Array) {
    for (const [index, datum] of newData.entries()) {
      validateSingleCurrentData({
        newData: datum,
        currentData: currentData[index],
      });
    }
  } else {
    validateSingleCurrentData({ newData, currentData });
  }
};

const validateSingleCurrentData = function ({ newData, currentData }) {
  const differentId = newData.id !== currentData.id;
  if (differentId) {
    const message = `'args.currentData' has invalid 'id': ${currentData.id}`;
    throw new EngineError(message, { reason: 'INPUT_SERVER_VALIDATION' });
  }
};


module.exports = {
  commandValidation,
};
