'use strict';

const { pick } = require('../../utilities');
const { addJsl } = require('../../jsl');
const { addLogInfo } = require('../../logging');

// Converts from Action format to Command format
const commandConvertor = async function (nextFunc, oInput) {
  const { jsl, command } = oInput;

  const input = pick(oInput, commandAttributes);
  const newInput = addJsl({ input, jsl, params: { $COMMAND: command.type } });
  const nextInput = addLogInfo(newInput, { command });

  const response = await nextFunc(nextInput);
  return response;
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
