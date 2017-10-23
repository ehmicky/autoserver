'use strict';

// Adds defaults `model.commands`
const addDefaultCommands = function (model) {
  const { commands = DEFAULT_COMMANDS } = model;

  return { ...model, commands };
};

// By default, include all commands
const DEFAULT_COMMANDS = ['create', 'find', 'replace', 'delete'];

module.exports = {
  addDefaultCommands,
};
