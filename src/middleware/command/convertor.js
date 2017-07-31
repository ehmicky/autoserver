'use strict';

const { pick } = require('../../utilities');
const { addJsl } = require('../../jsl');
const { addLogInfo } = require('../../logging');
const { commonAttributes } = require('../common_attributes');

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
  ...commonAttributes,
  'command',
  'args',
  'modelName',
  'params',
  'settings',
];

module.exports = {
  commandConvertor,
};
