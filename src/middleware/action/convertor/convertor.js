'use strict';

const { pick } = require('../../../utilities');
const { addJsl } = require('../../../jsl');
const { addLogInfo } = require('../../../logging');

const { getLogActions } = require('./log_actions');
const { getTransformedResponse } = require('./transform');

// Converts from Operation format to Action format
const actionConvertor = async function (nextFunc, input) {
  const { args, modelName, action, fullAction, operation } = input;

  const inputA = pick(input, actionAttributes);

  const inputB = addJsl(inputA, { $MODEL: modelName });
  const inputC = addLogInfo(inputB, { action, fullAction, model: modelName });

  const response = await nextFunc(inputC);
  const transformedResponse = handleResponse({
    response,
    input: inputC,
    args,
    operation,
  });
  return transformedResponse;
};

// Not kept: goal, queryVars, pathVars, payload, route, operation
const actionAttributes = [
  'currentPerf',
  'action',
  'fullAction',
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

const handleResponse = function ({ response, input, args, operation }) {
  const logActions = getLogActions({ input, response, args });
  const responseA = addLogInfo(response, { actions: logActions });

  const responseB = getTransformedResponse({
    input,
    response: responseA,
    args,
    operation,
  });
  return responseB;
};

module.exports = {
  actionConvertor,
};
