'use strict';

const { pSetTimeout } = require('../../../utilities');

const { processResponse } = require('./process_response');
const commands = require('./commands');

const fireCommand = async function (commandInput) {
  const { command, opts } = commandInput;
  const { data, metadata } = commands[command.name](commandInput);

  // Simulate asynchronousity
  // TODO: remove when there is a real ORM
  await pSetTimeout(0);

  const dataA = processResponse({ data, opts });

  return { response: { data: dataA, metadata } };
};

module.exports = {
  fireCommand,
};
