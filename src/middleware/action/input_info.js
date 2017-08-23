'use strict';

// Add action-related input information
const addActionInputInfo = function ({ modelName }) {
  return {
    ifvParams: { $MODEL: modelName },
  };
};

module.exports = {
  addActionInputInfo,
};
