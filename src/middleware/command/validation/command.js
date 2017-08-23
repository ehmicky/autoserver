'use strict';

const { isEqual } = require('lodash');

const { COMMANDS } = require('../../../constants');
const { throwError } = require('../../../error');

// Validate that command is among the possible ones
const validateCommand = function ({ command }) {
  const isValid = COMMANDS.some(possibleCommand =>
    isEqual(possibleCommand, command)
  );
  if (isValid) { return; }

  const message = `Invalid command: ${JSON.stringify(command)}`;
  throwError(message, { reason: 'INPUT_SERVER_VALIDATION' });
};

module.exports = {
  validateCommand,
};
