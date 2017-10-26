'use strict';

const { uniq } = require('lodash');

const { throwError } = require('../error');

const COMMANDS = [
  {
    name: 'findOne',
    type: 'find',
    multiple: false,
    title: 'search for',
  },
  {
    name: 'findMany',
    type: 'find',
    multiple: true,
    title: 'search for',
  },
  {
    name: 'createOne',
    type: 'create',
    multiple: false,
    title: 'create',
  },
  {
    name: 'createMany',
    type: 'create',
    multiple: true,
    title: 'create',
  },
  {
    name: 'replaceOne',
    type: 'replace',
    multiple: false,
    title: 'replace',
  },
  {
    name: 'replaceMany',
    type: 'replace',
    multiple: true,
    title: 'replace',
  },
  {
    name: 'patchOne',
    type: 'patch',
    multiple: false,
    title: 'patch',
  },
  {
    name: 'patchMany',
    type: 'patch',
    multiple: true,
    title: 'patch',
  },
  {
    name: 'deleteOne',
    type: 'delete',
    multiple: false,
    title: 'delete',
  },
  {
    name: 'deleteMany',
    type: 'delete',
    multiple: true,
    title: 'delete',
  },
];

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

module.exports = {
  COMMANDS,
  COMMAND_TYPES,
  getCommand,
};
