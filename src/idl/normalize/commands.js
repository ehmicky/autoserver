'use strict';

const { assignArray } = require('../../utilities');

// Normalize `commands` shortcuts, e.g. 'read' -> 'readOne' + 'readMany'
const normalizeCommands = function ({ idl }) {
  idl.commands = normalizeCommandNames(idl.commands || defaultCommandNames);
  return idl;
};

const normalizeCommandNames = function (commandNames) {
  return commandNames
    .map(name => /(One)|(Many)$/.test(name)
      ? name
      : [`${name}One`, `${name}Many`])
    .reduce(assignArray, []);
};

// By default, include all commandNames but deleteMany
const defaultCommandNames = [
  'createOne',
  'createMany',
  'readOne',
  'readMany',
  'updateOne',
  'updateMany',
  'deleteOne',
];

module.exports = {
  normalizeCommands,
  normalizeCommandNames,
};
