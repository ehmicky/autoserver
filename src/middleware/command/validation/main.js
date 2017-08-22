'use strict';

const { validateCommand } = require('./command');
const { validateCurrentData } = require('./current_data');

// Command-related validation middleware
// Check input, for the errors that should not happen,
// i.e. server-side (e.g. 500)
const commandValidation = function (input) {
  const inputB = validators.reduce(
    (inputA, validator) => validator(inputA),
    input,
  );

  return inputB;
};

const validators = [
  validateCommand,
  validateCurrentData,
];

module.exports = {
  commandValidation,
};
