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
const validateOpts = function ({ prefix = '', opt, availableOpts }) {
  if (!opt || opt.constructor !== Object) { return; }

  Object.entries(opt).forEach(([optName, optVal]) =>
    validateOpt({ prefix, optName, optVal, availableOpts })
  );
};

const validateOpt = function ({ prefix, optName, optVal, availableOpts }) {
  const name = `${prefix}${optName}`;
  const {
    validate = {},
    subConfFiles,
  } = getAvailableOpt({ name, availableOpts });

  checkOpt({ name, validate, optVal });

  // Sub-conf options do not recurse
  // E.g. IDL file is a sub-conf which resolves to an object, but IDL properties
  // are not options themselves
  if (subConfFiles !== undefined) { return; }

  // Recurse otherwise
  validateOpts({ prefix: `${name}.`, opt: optVal, availableOpts });
};

// Retrieve from `availableOptions`
const getAvailableOpt = function ({ name, availableOpts }) {
  const availableOpt = availableOpts.find(({ name: nameA }) => nameA === name);

  if (!availableOpt) {
    const message = `Option '${name}' is unknown`;
    throwError(message, { reason: 'CONF_VALIDATION' });
  }

  return availableOpt;
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
