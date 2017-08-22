'use strict';

const { addReqInfo } = require('../../events');

// Add action-related output information
const addActionOutputInfo = function (input) {
  const { args } = input;
  const infoActions = getInfoActions({ input, args });
  addReqInfo(input, { actions: infoActions });

  return input;
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
