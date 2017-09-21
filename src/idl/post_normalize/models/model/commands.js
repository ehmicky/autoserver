'use strict';

// Adds defaults commands
const normalizeCommands = function (model) {
  const { commands = defaultCommands } = model;

  return { ...model, commands };
};

// By default, include all commands
const defaultCommands = [
  'create',
  'read',
  'update',
  'delete',
];

module.exports = {
  normalizeCommands,
};
