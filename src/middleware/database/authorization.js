'use strict';


const { EngineError } = require('../../error');


// Main authorization layer
const authorization = function () {
  return async function authorization(input) {
    const { log, modelName, command, idl: { models } } = input;
    const perf = log.perf.start('database.authorization', 'middleware');

    const model = models[modelName];
    validateCommands({ model, command });

    perf.stop();
    const response = await this.next(input);
    return response;
  };
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
