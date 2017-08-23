'use strict';

// Add action-related input information
const addActionInputInfo = function ({ modelName, action, fullAction }) {
  return {
    reqInfo: { model: modelName, action: action.name, actionPath: fullAction },
    ifvParams: { $MODEL: modelName },
  };
};

module.exports = {
  addActionInputInfo,
};
