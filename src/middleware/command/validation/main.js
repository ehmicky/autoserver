'use strict';

const { validateCommand } = require('./command');
const { validateCurrentData } = require('./current_data');

// Command-related validation middleware
// Check input, for the errors that should not happen,
// i.e. server-side (e.g. 500)
const commandValidation = function ({ args, command }) {
  validators.forEach(validator => validator({ args, command }));
};

const validators = [
  validateCommand,
  validateCurrentData,
];

module.exports = {
  commandValidation,
};
