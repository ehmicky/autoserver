'use strict';

const { addIfv } = require('../../idl_func');
const { addReqInfoIfError } = require('../../events');

// Add command-related information
const addCommandInfoIn = function (input) {
  const { command } = input;

  const inputA = addIfv(input, { $COMMAND: command.type });

  return inputA;
};

const eAddCommandInfoIn = addReqInfoIfError(addCommandInfoIn, ['command']);

module.exports = {
  addCommandInfoIn: eAddCommandInfoIn,
};
