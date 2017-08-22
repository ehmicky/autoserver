'use strict';

const { validateInputData } = require('./input');

// Custom data validation middleware
// Checks that input and output conforms to API schema
const dataValidation = function (input) {
  const inputA = validateInputData({ input });

  return inputA;
};

module.exports = {
  dataValidation,
};
