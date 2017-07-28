'use strict';

const { cloneDeep } = require('lodash');

const { pick } = require('../../../utilities');
const { addJsl } = require('../../../jsl');
const { addLogInfo } = require('../../../logging');

const { getLogActions } = require('./log_actions');
const { getTransformedResponse } = require('./transform');

// Converts from Operation format to Action format
const actionConvertor = async function (nextFunc, oInput) {
  const { args, modelName, action, fullAction, operation } = oInput;

  const input = pick(oInput, actionAttributes);

  const newInput = addJsl({ input, params: { $MODEL: modelName } });
  const nextInput = addLogInfo(newInput, {
    action,
    fullAction,
    model: modelName,
  });

  // Request arguments that cannot be specified by clients
  const clonedArgs = cloneDeep(args);

  const response = await nextFunc(nextInput);
  const transformedResponse = handleResponse({
    response,
    input: nextInput,
    args: clonedArgs,
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
  const newResponse = addLogInfo(response, { actions: logActions });

  const transformedResponse = getTransformedResponse({
    input,
    response: newResponse,
    args,
    operation,
  });
  return transformedResponse;
};

module.exports = {
  actionConvertor,
};
