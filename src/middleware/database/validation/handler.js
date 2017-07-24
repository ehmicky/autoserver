'use strict';

const { validateInputData } = require('./input');
const { validateOutputData } = require('./output');

/**
 * Custom data validation middleware
 * Checks that input and output conforms to API schema
 **/
const dataValidation = async function (nextFunc, input) {
  const { modelName, args, command, jsl, idl } = input;

  validateInputData({ idl, modelName, command, args, jsl });

  const response = await nextFunc(input);

  validateOutputData({ idl, modelName, response, command, jsl });

  return response;
};

module.exports = {
  dataValidation,
};
