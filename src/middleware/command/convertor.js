'use strict';

const { pick } = require('../../utilities');
const { rethrowError } = require('../../error');
const { addJsl } = require('../../jsl');

// Converts from Action format to Command format
const commandConvertor = async function (nextFunc, oInput) {
  const { jsl, log, command } = oInput;

  const input = pick(oInput, commandAttributes);
  const nextInput = addJsl({ input, jsl, params: { $COMMAND: command.type } });

  try {
    const response = await nextFunc(nextInput);
    return response;
  } catch (error) {
    // Added only for final error handler
    log.add({ command });

    rethrowError(error);
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
