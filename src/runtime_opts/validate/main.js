'use strict';

const { throwError } = require('../../error');
const availableRuntimeOpts = require('../available');

const rules = require('./rules');

// Validation for runtime options
const validateRuntimeOpts = function ({ runtimeOpts }) {
  validateOpts({ opt: runtimeOpts });
  return { runtimeOpts };
};

// Recursively validate each runtime option, including intermediate objects
// in object chains
const validateOpts = function ({ name = '', opt }) {
  if (!opt || opt.constructor !== Object) { return; }

  Object.entries(opt).forEach(([nameVal, optVal]) => {
    validateOpt({ name: `${name}${nameVal}`, optVal });
    validateOpts({ name: `${nameVal}.`, opt: optVal });
  });
};

const validateOpt = function ({ name, optVal }) {
  if (optVal === undefined) { return; }

  const schema = getValidateSchema({ name });

  // Validate runtime option against each `validate` rule
  Object.entries(schema).forEach(([ruleType, ruleVal]) =>
    validateRule({ name, optVal, ruleVal, ruleType })
  );
};

// Retrieve `validate` from availableRuntimeOpts
const getValidateSchema = function ({ name }) {
  const schema = availableRuntimeOpts.find(({ name: nameA }) => nameA === name);

  if (!schema) {
    const message = `Runtime option '${name}' is unknown`;
    throwError(message, { reason: 'RUNTIME_OPTS_VALIDATION' });
  }

  return schema.validate;
};

// Validate runtime option against single `validate` rule
const validateRule = function ({ name, optVal, ruleVal, ruleType }) {
  const rule = rules[ruleType];
  const errorMessage = rule({ optVal, ruleVal });

  if (errorMessage) {
    const message = `Runtime option '${name}' ${errorMessage}`;
    throwError(message, { reason: 'RUNTIME_OPTS_VALIDATION' });
  }
};

module.exports = {
  validateRuntimeOpts,
};
