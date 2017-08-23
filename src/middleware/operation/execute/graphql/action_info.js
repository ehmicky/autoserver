'use strict';

const { addReqInfo } = require('../../../../events');
const { assignObject } = require('../../../../utilities');

// Add action-related output information
const addActionOutputInfo = function ({ input, responses }) {
  const actions = responses
    .map(getInfoActions)
    .reduce(assignObject, {});
  const inputA = addReqInfo(input, { actions });
  return inputA;
};

// Formatted actions information, for events
const getInfoActions = function ({
  fullAction,
  modelName,
  response: { data },
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
