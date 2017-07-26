'use strict';

const { pick } = require('../../utilities');
const { throwError } = require('../../error');

// Converts from Action format to Command format
const commandConvertor = async function (nextFunc, input) {
  const { jsl, log, command } = input;

  const trimmedInput = pick(input, commandAttributes);
  const nextInput = jsl.addToInput(trimmedInput, { $COMMAND: command.type });

  try {
    const response = await nextFunc(nextInput);
    return response;
  } catch (error) {
    // Added only for final error handler
    log.add({ command });

    throwError(error);
  }
};

// Not kept: action, fullAction
const commandAttributes = [
  'currentPerf',
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
