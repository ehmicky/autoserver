'use strict';

const { pick } = require('../../../utilities');
const { addJsl } = require('../../../jsl');
const { addReqInfo, addLogIfError } = require('../../../events');
const { commonAttributes } = require('../../common_attributes');

const { getLogActions } = require('./log_actions');
const { getTransformedResponse } = require('./transform');

// Converts from Operation format to Action format
const actionConvertor = async function (nextFunc, input) {
  const { args, modelName, operation } = input;

  const inputA = pick(input, actionAttributes);
  const inputB = addJsl(inputA, { $MODEL: modelName });

  const response = await nextFunc(inputB);

  const logActions = getLogActions({ input, response, args });
  addReqInfo(input, { actions: logActions });

  const transformedResponse = getTransformedResponse({
    response,
    input: inputB,
    args,
    operation,
  });

  return transformedResponse;
};

const eActionConvertor = addLogIfError(
  actionConvertor,
  ['action', 'fullAction', 'modelName'],
);

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

module.exports = {
  actionConvertor: eActionConvertor,
};
