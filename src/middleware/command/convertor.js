'use strict';

const { pick } = require('../../utilities');

// Converts from Action format to Command format
const commandConvertor = async function (input) {
  const { jsl, log, command } = input;

  const trimmedInput = pick(input, commandAttributes);

  const newJsl = jsl.add({ $COMMAND: command.type });
  const nextInput = Object.assign({}, trimmedInput, { jsl: newJsl });

  try {
    const response = await this.next(nextInput);
    return response;
  } catch (error) {
    // Added only for final error handler
    log.add({ command });

    throw error;
  }
};

// Not kept: action, fullAction
const commandAttributes = [
  'command',
  'args',
  'modelName',
  'log',
  'perf',
  'idl',
  'serverOpts',
  'apiServer',
  'params',
  'settings',
];

module.exports = {
  commandConvertor,
};
