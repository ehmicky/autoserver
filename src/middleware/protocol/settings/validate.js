'use strict';

const { throwError } = require('../../../error');

// Generic settings validation
const validateSettings = function ({ settings }) {
  return Object.entries(settings).reduce(
    (settingsA, [name, value]) =>
      validateSetting({ settings: settingsA, name, value }),
    settings,
  );
};

const validateSetting = function ({ settings, name, value }) {
  const validator = validators[name];

  if (!validator) {
    const message = `Unknown settings: '${name}'`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  return validator({ settings, name, value });
};

const noOutput = function ({ settings, name, value }) {
  if (typeof value !== 'boolean') {
    const message = `'${name}' settings must be 'true' or 'false', not '${value}'`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  return settings;
};

const validators = {
  noOutput,
};

module.exports = {
  validateSettings,
};
