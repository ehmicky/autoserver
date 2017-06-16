'use strict';


const { isEqual } = require('lodash');

const { COMMANDS } = require('../../constants');
const { EngineError } = require('../../error');


/**
 * Command-related validation layer
 * Check input, for the errors that should not happen,
 * i.e. server-side (e.g. 500)
 **/
const commandValidation = function () {
  return async function commandValidation(input) {
    const { command, log, args } = input;
    const perf = log.perf.start('command.validation', 'middleware');

    validateCommand({ command });
    validateArgs({ args });

    perf.stop();
    const response = await this.next(input);
    return response;
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

const validateArgs = function ({
  args: { pagination, authorization, newData, currentData },
}) {
  if (pagination === undefined) {
    const message = '\'args.pagination\' must be defined';
    throw new EngineError(message, { reason: 'INPUT_SERVER_VALIDATION' });
  }

  if (authorization !== undefined && typeof authorization !== 'boolean') {
    const message = '\'args.authorization\' must be a boolean';
    throw new EngineError(message, { reason: 'INPUT_SERVER_VALIDATION' });
  }

  validateCurrentData({ newData, currentData });
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
