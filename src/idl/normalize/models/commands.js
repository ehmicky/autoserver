'use strict';

const { normalizeCommandNames } = require('../commands');

// Normalize `commands`, and adds defaults
const normalizeCommands = function (model, { idl }) {
  const commandNames = model.commands || idl.commands;
  const commands = normalizeCommandNames(commandNames);
  return { ...model, commands };
};

module.exports = {
  normalizeCommands,
};
