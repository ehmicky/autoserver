'use strict';

const { throwError } = require('../../../error');

// Generic settings validation
const validateSettings = function ({ settings }) {
  for (const [name, value] of Object.entries(settings)) {
    const validator = validators[name];

    if (!validator) {
      const message = `Unknown settings: '${name}'`;
      throwError(message, { reason: 'INPUT_VALIDATION' });
    }

    validator({ name, value });
  }
};

const noOutput = function ({ name, value }) {
  if (typeof value !== 'boolean') {
    const message = `'${name}' settings must be 'true' or 'false', not '${value}'`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }
};

const validators = {
  noOutput,
};

module.exports = {
  validateSettings,
};
