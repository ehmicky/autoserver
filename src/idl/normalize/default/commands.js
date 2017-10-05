'use strict';

// Adds defaults `model.commands`
const addDefaultCommands = function (model) {
  const { commands = defaultCommands } = model;

  return { ...model, commands };
};

// By default, include all commands
const defaultCommands = [
  'create',
  'find',
  'replace',
  'delete',
];

module.exports = {
  addDefaultCommands,
};
