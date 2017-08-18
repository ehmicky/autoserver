'use strict';

const { throwError } = require('../../error');

const rules = require('./rules');

// Validation for options
const validateOptions = function ({ options, availableOpts }) {
  validateOpts({ opt: options, availableOpts });
  return { options };
};

// Recursively validate each option, including intermediate objects
// in object chains
const validateOpts = function ({ name = '', opt, availableOpts }) {
  if (!opt || opt.constructor !== Object) { return; }

  Object.entries(opt).forEach(([nameVal, optVal]) => {
    validateOpt({ name: `${name}${nameVal}`, optVal, availableOpts });
    validateOpts({ name: `${nameVal}.`, opt: optVal, availableOpts });
  });
};

const validateOpt = function ({ name, optVal, availableOpts }) {
  if (optVal === undefined) { return; }

  const schema = getValidateSchema({ name, availableOpts });

  // Validate option against each `validate` rule
  Object.entries(schema).forEach(([ruleType, ruleVal]) =>
    validateRule({ name, optVal, ruleVal, ruleType })
  );
};

// Retrieve `validate` from availableOptions
const getValidateSchema = function ({ name, availableOpts }) {
  const schema = availableOpts.options
    .find(({ name: nameA }) => nameA === name);

  if (!schema) {
    const message = `Option '${name}' is unknown`;
    throwError(message, { reason: 'CONF_VALIDATION' });
  }

  return schema.validate;
};

// Validate option against single `validate` rule
const validateRule = function ({ name, optVal, ruleVal, ruleType }) {
  const rule = rules[ruleType];
  const errorMessage = rule({ optVal, ruleVal });

  if (errorMessage) {
    const message = `Option '${name}' ${errorMessage}`;
    throwError(message, { reason: 'CONF_VALIDATION' });
  }
};

module.exports = {
  validateOptions,
};
