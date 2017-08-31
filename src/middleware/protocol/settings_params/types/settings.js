'use strict';

const { throwError } = require('../../../../error');
const { fastValidate, booleanTest } = require('../../../../fast_validation');

const { headersPrefix: paramsHeadersPrefix } = require('./params');

// Settings headers start with X-Api-Engine
const headersTest = function ({ name }) {
  return headersPrefix.test(name) && !paramsHeadersPrefix.test(name);
};

const headersPrefix = /^x-api-engine-/i;

// Protocol-specific settings parser
const getSpecificValues = function ({ mInput, mInput: { protocolHandler } }) {
  const specificSettings = protocolHandler.getSettings(mInput);

  if (!specificSettings || specificSettings.constructor !== Object) {
    const message = `'specificSettings' must be an object, not '${specificSettings}'`;
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  return specificSettings;
};

// Validate settings
const validateValue = function ({ name, value }) {
  const tests = validators[name];

  if (!tests) {
    const message = `Unknown settings: '${name}'`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  fastValidate(
    { prefix: 'Wrong settings: ', reason: 'INPUT_VALIDATION', tests },
    { [name]: value },
  );
};

const validators = {
  silent: [
    booleanTest('silent'),
  ],

  dryrun: [
    booleanTest('dryrun'),
  ],
};

const settings = {
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
