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
  if (optVal === undefined) { return; }

  const name = `${prefix}${optName}`;
  const availableOpt = getAvailableOpt({ name, availableOpts });

  // Validate option against each `validate` rule
  const { schema = {} } = availableOpt;
  Object.entries(schema).forEach(([ruleType, ruleVal]) =>
    validateRule({ name, optVal, ruleVal, ruleType })
  );

  // Sub-conf options do not recurse
  if (availableOpt.subConfFiles !== undefined) { return; }

  validateOpts({ prefix: `${name}.`, opt: optVal, availableOpts });
};

// Retrieve from availableOptions
const getAvailableOpt = function ({ name, availableOpts }) {
  const availableOpt = availableOpts.find(({ name: nameA }) => nameA === name);

  if (!availableOpt) {
    const message = `Option '${name}' is unknown`;
    throwError(message, { reason: 'CONF_VALIDATION' });
  }

  return availableOpt;
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
