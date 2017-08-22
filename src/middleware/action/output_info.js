'use strict';

const { addReqInfo } = require('../../events');

// Add action-related output information
const addActionOutputInfo = async function (nextFunc, input) {
  const inputA = await nextFunc(input);

  const { args } = inputA;
  const infoActions = getInfoActions({ input: inputA, args });
  addReqInfo(inputA, { actions: infoActions });

  return inputA;
};

// Formatted actions information, for events
const getInfoActions = function ({
  input: { fullAction, modelName, response: { data } },
  args,
}) {
  const infoData = Array.isArray(data) ? data : [data];
  const responses = infoData.map(content => ({ content }));
  const infoAction = { model: modelName, args, responses };
  const infoActions = { [fullAction]: infoAction };
  return infoActions;
};

module.exports = {
  addActionOutputInfo,
};
