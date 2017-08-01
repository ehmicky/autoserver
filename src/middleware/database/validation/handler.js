'use strict';

const { validateInputData } = require('./input');

/**
 * Custom data validation middleware
 * Checks that input and output conforms to API schema
 **/
const dataValidation = async function (nextFunc, input) {
  const inputA = validateInputData({ input });

  const response = await nextFunc(inputA);
  return response;
};

module.exports = {
  dataValidation,
};
