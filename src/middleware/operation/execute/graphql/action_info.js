'use strict';

const { assignObject } = require('../../../../utilities');

// Add action-related output information
const getActionOutputInfo = function ({ responses }) {
  const actionsInfo = responses
    .map(getInfoActions)
    .reduce(assignObject, {});
  return { actionsInfo };
};

// Formatted actions information, for events
const getInfoActions = function ({
  fullAction,
  modelName,
  response: { data },
  oArgs: args,
}) {
  const infoData = Array.isArray(data) ? data : [data];
  const responses = infoData.map(content => ({ content }));
  const infoAction = { model: modelName, args, responses };
  const infoActions = { [fullAction]: infoAction };
  return infoActions;
};

module.exports = {
  getActionOutputInfo,
};
