'use strict';

const { addIfv } = require('../../idl_func');
const { addReqInfoIfError } = require('../../events');

// Add action-related input information
const addActionInputInfo = function (nextFunc, input) {
  const { modelName } = input;

  const inputA = addIfv(input, { $MODEL: modelName });

  return nextFunc(inputA);
};

const eAddActionInputInfo = addReqInfoIfError(
  addActionInputInfo,
  ['action', 'fullAction', 'modelName'],
);

module.exports = {
  addActionInputInfo: eAddActionInputInfo,
};
