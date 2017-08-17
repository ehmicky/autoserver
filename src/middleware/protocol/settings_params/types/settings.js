'use strict';

const { throwError } = require('../../../../error');

const { headersPrefix: paramsHeadersPrefix } = require('./params');

// Settings headers start with X-Api-Engine
const headersTest = function ({ name }) {
  return headersPrefix.test(name) && !paramsHeadersPrefix.test(name);
};

const headersPrefix = /^x-api-engine-/i;

// Protocol-specific settings parser
const getSpecificValues = function ({ input, input: { protocolHandler } }) {
  const specificSettings = protocolHandler.getSettings({ input });

  if (!specificSettings || specificSettings.constructor !== Object) {
    const message = `'specificSettings' must be an object, not '${specificSettings}'`;
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  return specificSettings;
};

// Validate settings
const validateValue = function ({ values, name, value }) {
  const validator = validators[name];

  if (!validator) {
    const message = `Unknown settings: '${name}'`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  return validator({ values, name, value });
};

const validateBooleanSettings = function ({ values, name, value }) {
  if (typeof value !== 'boolean') {
    const message = `'${name}' settings must be 'true' or 'false', not '${value}'`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  return values;
};

const validators = {
  silent: validateBooleanSettings,
  dryrun: validateBooleanSettings,
};

const settings = {
  idlFuncName: '$SETTINGS',
  genericName: 'settings',
  queryVarName: 'settings',
  headersTest,
  headersPrefix,
  getSpecificValues,
  validateValue,
};

module.exports = {
  settings,
};
