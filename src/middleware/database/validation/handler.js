'use strict';

const { validateInputData } = require('./input');
const { validateOutputData } = require('./output');

/**
 * Custom data validation middleware
 * Checks that input and output conforms to API schema
 **/
const dataValidation = async function (input) {
  const { modelName, args, command, jsl, idl } = input;

  validateInputData({ idl, modelName, command, args, jsl });

  const response = await this.next(input);

  validateOutputData({ idl, modelName, response, command, jsl });

  return response;
};

module.exports = {
  dataValidation,
};
