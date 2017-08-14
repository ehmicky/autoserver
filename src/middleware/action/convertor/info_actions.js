'use strict';

// Formatted actions information, for events
const getInfoActions = function ({
  input: { fullAction, modelName },
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
  getInfoActions,
};
