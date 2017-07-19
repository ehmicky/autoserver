'use strict';

const { EngineError } = require('../../error');

// Main authorization layer
const authorization = async function (input) {
  const { modelName, command, idl: { models } } = input;

  const model = models[modelName];
  validateCommands({ model, command });

  const response = await this.next(input);
  return response;
};

const validateCommands = function ({ model: { commands }, command }) {
  if (!commands.includes(command.name)) {
    const message = `Command '${command.type}' is not allowed`;
    throw new EngineError(message, { reason: 'AUTHORIZATION' });
  }
};

module.exports = {
  authorization,
};
