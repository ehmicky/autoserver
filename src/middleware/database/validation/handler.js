'use strict';

const { validateInputData } = require('./input');
const { validateOutputData } = require('./output');

/**
 * Custom data validation middleware
 * Checks that input and output conforms to API schema
 **/
const dataValidation = async function (nextFunc, input) {
  const inputA = validateInputData({ input });

  const response = await nextFunc(inputA);

  const responseA = validateOutputData({ input, response });

  return responseA;
};

module.exports = {
  dataValidation,
};
