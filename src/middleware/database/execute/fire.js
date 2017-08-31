'use strict';

const { pSetTimeout } = require('../../../utilities');

const { processResponse } = require('./process_response');
const commands = require('./commands');

const fireCommand = async function (commandInput) {
  const { command, opts } = commandInput;
  const response = commands[command.name](commandInput);

  // Simulate asynchronousity
  // TODO: remove when there is a real ORM
  await pSetTimeout(0);

  const responseA = processResponse({ response, command, opts });
  const responseB = { ...response, ...responseA };

  return { response: responseB };
};

module.exports = {
  fireCommand,
};
