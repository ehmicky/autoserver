'use strict';

const { addIfv } = require('../../idl_func');
const { addReqInfoIfError } = require('../../events');

// Converts from Action format to Command format
const commandConvertor = function (nextFunc, input) {
  const { command } = input;

  const inputA = addIfv(input, { $COMMAND: command.type });

  return nextFunc(inputA);
};

const eCommandConvertor = addReqInfoIfError(commandConvertor, ['command']);

module.exports = {
  commandConvertor: eCommandConvertor,
};
