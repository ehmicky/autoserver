'use strict';

const { throwError } = require('../../error');
const { getFlatOpts } = require('../flat_opts');

const rules = require('./rules');

// Validation for options
const validateOptions = function ({ options, availableOpts }) {
  const flatOpts = getFlatOpts({ options, availableOpts });
  flatOpts
    // Unknown options coming from environment variables are ignored
    // Other unknown options cannot be present at this stage, as they have
    // been previously validated.
    .filter(({ unknown }) => !unknown)
    .forEach(checkOpt);
};

const checkOpt = function ({ name, validate, optVal }) {
  const isEmpty = optVal === undefined;
  const validateA = checkRequired({ name, isEmpty, validate });
  if (isEmpty) { return; }

  // Validate option against each `validate` rule
  Object.entries(validateA).forEach(([ruleType, ruleVal]) =>
    validateRule({ name, optVal, ruleVal, ruleType }));
};

const checkRequired = function ({
  name,
  isEmpty,
  validate: { required, ...validateA },
}) {
  if (isEmpty && required) {
    const message = `Option '${name}' is required`;
    throwError(message, { reason: 'CONF_VALIDATION' });
  }

  return validateA;
};

// Validate option against single `validate` rule
const validateRule = function ({ name, optVal, ruleVal, ruleType }) {
  // If the option is array, `validate` applies on each element
  if (Array.isArray(optVal) && !ARRAY_RULES.includes(ruleType)) {
    return optVal
      .map(opt => validateRule({ name, optVal: opt, ruleVal, ruleType }));
  }

  const rule = rules[ruleType];

  const errorMessage = rule({ optVal, ruleVal });

  if (errorMessage === undefined) { return; }

  const message = `Option '${name}' ${errorMessage}`;
  throwError(message, { reason: 'CONF_VALIDATION' });
};

// Rules applied on arrays, as opposed to each of their elements
const ARRAY_RULES = ['type', 'unique', 'min_items', 'max_items'];

module.exports = {
  validateOptions,
};
