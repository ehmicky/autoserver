'use strict';

const { uniq } = require('lodash');

const { throwError } = require('../error');

const COMMANDS = [
  { name: 'findOne', type: 'find', multiple: false },
  { name: 'findMany', type: 'find', multiple: true },
  { name: 'createOne', type: 'create', multiple: false },
  { name: 'createMany', type: 'create', multiple: true },
  { name: 'replaceOne', type: 'replace', multiple: false },
  { name: 'replaceMany', type: 'replace', multiple: true },
  { name: 'patchOne', type: 'patch', multiple: false },
  { name: 'patchMany', type: 'patch', multiple: true },
  { name: 'deleteOne', type: 'delete', multiple: false },
  { name: 'deleteMany', type: 'delete', multiple: true },
];

const types = COMMANDS.map(({ type }) => type);
const COMMAND_TYPES = uniq(types);

const getCommand = function ({ commandType, multiple }) {
  const commandA = COMMANDS.find(command =>
    command.multiple === multiple && command.type === commandType
  );

  if (commandA === undefined) {
    const message = `Command '${commandType}' is unknown`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  return commandA;
};

module.exports = {
  COMMANDS,
  COMMAND_TYPES,
  getCommand,
};
