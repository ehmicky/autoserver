'use strict';

const { processResponse } = require('./process_response');
const { validateResponse } = require('./validate');
const commands = require('./commands');

const fireCommand = function (commandInput) {
  const { command, opts } = commandInput;
  const response = commands[command.name](commandInput);

  const responseA = processResponse({ response, command, opts });
  const responseB = { ...response, ...responseA };

  validateResponse({ command, response: responseB });

  return responseB;
};

module.exports = {
  fireCommand,
};
