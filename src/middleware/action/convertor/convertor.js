'use strict';

const { addIfv } = require('../../../idl_func');
const { addReqInfo, addReqInfoIfError } = require('../../../events');

const { getInfoActions } = require('./info_actions');
const { getTransformedResponse } = require('./transform');

// Converts from Operation format to Action format
const actionConvertor = async function (nextFunc, input) {
  const { args, modelName, operation } = input;

  const inputA = addIfv(input, { $MODEL: modelName });

  const inputB = await nextFunc(inputA);

  const infoActions = getInfoActions({ input: inputB, args });
  addReqInfo(inputB, { actions: infoActions });

  const inputC = getTransformedResponse({ input: inputB, args, operation });

  return inputC;
};

const eActionConvertor = addReqInfoIfError(
  actionConvertor,
  ['action', 'fullAction', 'modelName'],
);

module.exports = {
  actionConvertor: eActionConvertor,
};
