'use strict';

const { pick } = require('../../../utilities');
const { addJsl } = require('../../../jsl');
const { addLogInfo, removeLogInfo } = require('../../../events');
const { commonAttributes } = require('../../common_attributes');

const { getLogActions } = require('./log_actions');
const { getTransformedResponse } = require('./transform');

// Converts from Operation format to Action format
const actionConvertor = async function (nextFunc, input) {
  const { args, modelName, action, fullAction, operation } = input;

  const inputA = pick(input, actionAttributes);

  const inputB = addJsl(inputA, { $MODEL: modelName });
  const inputC = addLogInfo(inputB, { action, fullAction, model: modelName });

  const response = await nextFunc(inputC);

  addInfo({ response, input, args });
  const transformedResponse = getTransformedResponse({
    response,
    input: inputC,
    args,
    operation,
  });
  return transformedResponse;
};

// Not kept: goal, queryVars, pathVars, payload, route, operation
const actionAttributes = [
  ...commonAttributes,
  'action',
  'fullAction',
  'args',
  'modelName',
  'params',
  'settings',
];

const addInfo = function ({ response, input, args }) {
  const logActions = getLogActions({ input, response, args });
  const inputA = addLogInfo(input, { actions: logActions });
  const inputB = removeLogInfo(inputA, unusedInfo);
  return inputB;
};

// Those log information are only useful if an exception is thrown
// in the middle of an action
const unusedInfo = [
  'action',
  'fullAction',
  'model',
  'command',
  'args',
];

module.exports = {
  actionConvertor,
};
