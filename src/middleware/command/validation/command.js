'use strict';

const { isEqual } = require('lodash');

const { COMMANDS } = require('../../../constants');
const { throwError } = require('../../../error');

// Validate that command is among the possible ones
const validateCommand = function (input) {
  const { command } = input;

  const isValid = COMMANDS.some(possibleCommand =>
    isEqual(possibleCommand, command)
  );
  if (isValid) { return input; }

  const message = `Invalid command: ${JSON.stringify(command)}`;
  throwError(message, { reason: 'INPUT_SERVER_VALIDATION' });
};

module.exports = {
  validateCommand,
};
