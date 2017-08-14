'use strict';

const { pick } = require('../../../utilities');
const { addJsl } = require('../../../jsl');
const { addReqInfo, addReqInfoIfError } = require('../../../events');
const { commonAttributes } = require('../../common_attributes');

const { getInfoActions } = require('./info_actions');
const { getTransformedResponse } = require('./transform');

// Converts from Operation format to Action format
const actionConvertor = async function (nextFunc, input) {
  const { args, modelName, operation } = input;

  const inputA = pick(input, actionAttributes);
  const inputB = addJsl(inputA, { $MODEL: modelName });

  const response = await nextFunc(inputB);

  const infoActions = getInfoActions({ input, response, args });
  addReqInfo(input, { actions: infoActions });

  const transformedResponse = getTransformedResponse({
    response,
    input: inputB,
    args,
    operation,
  });

  return transformedResponse;
};

const eActionConvertor = addReqInfoIfError(
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
