'use strict';

const { addIfv } = require('../../idl_func');
const { addReqInfo } = require('../../events');

// Add action-related input information
const addActionInputInfo = function (input) {
  const { modelName, action, fullAction } = input;

  const inputA = addIfv(input, { $MODEL: modelName });
  const inputB = addReqInfo(inputA, {
    model: modelName,
    action: action.name,
    actionPath: fullAction,
  });

  return inputB;
};

module.exports = {
  addActionInputInfo,
};
