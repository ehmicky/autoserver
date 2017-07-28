'use strict';

const { assignArray } = require('../../utilities');

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

// Normalize `commands` shortcuts, e.g. 'read' -> 'readOne' + 'readMany'
const normalizeCommands = function ({ idl }) {
  const commands = normalizeCommandNames(idl.commands || defaultCommandNames);
  return { ...idl, commands };
};

const normalizeCommandNames = function (commandNames) {
  return commandNames
    .map(name =>
      ((/(One)|(Many)$/).test(name) ? name : [`${name}One`, `${name}Many`])
    )
    .reduce(assignArray, []);
};

module.exports = {
  normalizeCommands,
  normalizeCommandNames,
};
