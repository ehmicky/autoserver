'use strict';

const { throwError } = require('../../error');

const rules = require('./rules');

// Validation for options
const validateOptions = function ({ flatOpts }) {
  flatOpts.forEach(checkOpt);
};

const checkOpt = function ({ name, validate, optVal }) {
  const isEmpty = optVal === undefined;
  const validateA = checkRequired({ name, isEmpty, validate });
  if (isEmpty) { return; }

  // Validate option against each `validate` rule
  Object.entries(validateA).forEach(([ruleType, ruleVal]) =>
    validateRule({ name, optVal, ruleVal, ruleType })
  );
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
