'use strict';

const { uniq } = require('lodash');

const { throwError } = require('../error');

const COMMANDS = [
  {
    name: 'findOne',
    type: 'find',
    multiple: false,
    title: 'search for',
    participle: 'searched',
  },
  {
    name: 'findMany',
    type: 'find',
    multiple: true,
    title: 'search for',
    participle: 'searched',
  },
  {
    name: 'createOne',
    type: 'create',
    multiple: false,
    title: 'create',
    participle: 'created',
  },
  {
    name: 'createMany',
    type: 'create',
    multiple: true,
    title: 'create',
    participle: 'created',
  },
  {
    name: 'replaceOne',
    type: 'replace',
    multiple: false,
    title: 'replace',
    participle: 'replaced',
  },
  {
    name: 'replaceMany',
    type: 'replace',
    multiple: true,
    title: 'replace',
    participle: 'replaced',
  },
  {
    name: 'patchOne',
    type: 'patch',
    multiple: false,
    title: 'patch',
    participle: 'patched',
  },
  {
    name: 'patchMany',
    type: 'patch',
    multiple: true,
    title: 'patch',
    participle: 'patched',
  },
  {
    name: 'deleteOne',
    type: 'delete',
    multiple: false,
    title: 'delete',
    participle: 'deleted',
  },
  {
    name: 'deleteMany',
    type: 'delete',
    multiple: true,
    title: 'delete',
    participle: 'deleted',
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
