'use strict';

const { addIfv } = require('../../idl_func');
const { addReqInfo } = require('../../events');

// Add command-related information
const addCommandInfoIn = function (input) {
  const { command } = input;

  const inputA = addIfv(input, { $COMMAND: command.type });
  const inputB = addReqInfo(inputA, { command: command.name });

  return inputB;
};

module.exports = {
  addCommandInfoIn,
};
