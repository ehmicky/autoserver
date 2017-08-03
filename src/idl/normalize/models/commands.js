'use strict';

const { assignArray } = require('../../../utilities');

// Normalize `commands` shortcuts, e.g. 'read' -> 'readOne' + 'readMany'
// Also add defaults
const normalizeCommands = function (model) {
  const { commands = defaultCommands } = model;
  const commandsA = commands
    .map(name =>
      ((/(One)|(Many)$/).test(name) ? name : [`${name}One`, `${name}Many`])
    )
    .reduce(assignArray, []);

  return { ...model, commands: commandsA };
};

// By default, include all commands but deleteMany
const defaultCommands = [
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
};
