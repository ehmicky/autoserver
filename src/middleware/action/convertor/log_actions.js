'use strict';

// Formatted actions information, for logging
const getLogActions = function ({
  input: { fullAction, modelName },
  response: { data },
  args,
}) {
  const logData = Array.isArray(data) ? data : [data];
  const responses = logData.map(content => ({ content }));
  const logAction = { model: modelName, args, responses };
  const logActions = { [fullAction]: logAction };
  return logActions;
};

module.exports = {
  getLogActions,
};
