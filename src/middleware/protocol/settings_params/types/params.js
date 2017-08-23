'use strict';

const { throwError } = require('../../../../error');

// Settings headers start with X-Api-Engine-Param
const headersTest = function ({ name }) {
  return headersPrefix.test(name);
};

const headersPrefix = /^x-api-engine-param-/i;

// Validate parameter
const validateValue = function ({ values, name }) {
  if (!PARAMS_NAME_VALIDATION.test(name)) {
    const message = `Parameter '${name}' name should contain only letters or numbers, and start with a letter.`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  return values;
};

const PARAMS_NAME_VALIDATION = /^[a-zA-Z][a-zA-Z0-9]*$/;

const params = {
  genericName: 'params',
  queryVarName: 'params',
  headersTest,
  headersPrefix,
  validateValue,
};

module.exports = {
  params,
};
