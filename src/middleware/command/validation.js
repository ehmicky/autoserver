'use strict';

const { isEqual } = require('lodash');

const { COMMANDS } = require('../../constants');
const { throwError } = require('../../error');

/**
 * Command-related validation middleware
 * Check input, for the errors that should not happen,
 * i.e. server-side (e.g. 500)
 **/
const commandValidation = async function (nextFunc, input) {
  const { command, args } = input;

  validateCommand({ command });
  validateArgs({ args });

  const response = await nextFunc(input);
  return response;
};

// Validate that command is among the possible ones
const validateCommand = function ({ command }) {
  const isValid = COMMANDS.some(possibleCommand =>
    isEqual(possibleCommand, command)
  );

  if (!isValid) {
    const message = `Invalid command: ${JSON.stringify(command)}`;
    throwError(message, { reason: 'INPUT_SERVER_VALIDATION' });
  }
};

const validateArgs = function ({
  args: { internal, newData, currentData },
}) {
  if (internal !== undefined && typeof internal !== 'boolean') {
    const message = '\'args.internal\' must be a boolean';
    throwError(message, { reason: 'INPUT_SERVER_VALIDATION' });
  }

  validateCurrentData({ newData, currentData });
};

// Validate that `args.currentData` reflects `args.newData`
const validateCurrentData = function ({ newData, currentData }) {
  if (!currentData) { return; }

  validateDifferentTypes({ newData, currentData });

  if (Array.isArray(newData)) {
    for (const [index, datum] of newData.entries()) {
      validateCurrentDatum({
        newData: datum,
        currentData: currentData[index],
      });
    }
  } else {
    validateCurrentDatum({ newData, currentData });
  }
};

const validateDifferentTypes = function ({ newData, currentData }) {
  const differentTypes =
    (Array.isArray(newData) && !Array.isArray(currentData)) ||
    (!Array.isArray(newData) && Array.isArray(currentData)) ||
    (!newData && currentData);
  if (!differentTypes) { return; }

  const message = `'args.currentData' is invalid: ${JSON.stringify(currentData)}`;
  throwError(message, { reason: 'INPUT_SERVER_VALIDATION' });
};

const validateCurrentDatum = function ({ newData, currentData }) {
  if (!currentData) { return; }

  const differentId = newData.id !== currentData.id;

  if (differentId) {
    const message = `'args.currentData' has invalid 'id': ${currentData.id}`;
    throwError(message, { reason: 'INPUT_SERVER_VALIDATION' });
  }
};

module.exports = {
  commandValidation,
};
