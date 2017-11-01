'use strict';

const { uniq, assignArray } = require('../utilities');
const { throwError } = require('../error');

const COMMANDS = require('./commands');

const TYPES = COMMANDS.map(({ type }) => type);
const COMMAND_TYPES = uniq(TYPES);

const getCommand = function ({ commandType, multiple }) {
  const commandA = COMMANDS.find(command =>
    command.multiple === multiple && command.type === commandType);

  if (commandA === undefined) {
    const message = `Command '${commandType}' is unknown`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  return commandA;
};

// Merge each action `commandPath` into a comma-separated list
const mergeCommandPaths = function ({ actions }) {
  return actions
    .map(({ commandPath }) => commandPath.join('.'))
    .reduce(assignArray, [])
    .join(', ');
};

module.exports = {
  COMMANDS,
  COMMAND_TYPES,
  getCommand,
  mergeCommandPaths,
};
