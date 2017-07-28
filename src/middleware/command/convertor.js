'use strict';

const { pick } = require('../../utilities');
const { addJsl } = require('../../jsl');
const { addLogInfo } = require('../../logging');

// Converts from Action format to Command format
const commandConvertor = async function (nextFunc, input) {
  const { command } = input;

  const inputA = pick(input, commandAttributes);
  const inputB = addJsl(inputA, { $COMMAND: command.type });
  const inputC = addLogInfo(inputB, { command });

  const response = await nextFunc(inputC);
  return response;
};

// Not kept: action, fullAction
const commandAttributes = [
  'currentPerf',
  'command',
  'args',
  'modelName',
  'log',
  'jsl',
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
