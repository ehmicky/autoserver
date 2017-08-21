'use strict';

const { defaultsDeep } = require('lodash');

const { getEnvVars } = require('../conf');
const { omit } = require('../utilities');

// Default value for options
// Priority order:
//  - environment variables
//  - configuration files
//  - default options
const applyDefaultOptions = function ({ options, availableOpts }) {
  const optionsA = applyEnvVars({ options });
  const optionsB = applyDefaultOpts({ options: optionsA, availableOpts });
  return { options: optionsB };
};

// Apply environment variables
const applyEnvVars = function ({ options }) {
  const envVars = getEnvVars();

  // This was already handled
  const envVarsA = omit(envVars, 'config');

  return defaultsDeep({}, envVarsA, options);
};

// Apply `availableOptions` `default` values
const applyDefaultOpts = function ({ options, availableOpts }) {
  return availableOpts.options.reduce(
    (optionsA, { name, default: defValue }) =>
      applyDefaultOpt({ options: optionsA, name, defValue }),
    options,
  );
};

const applyDefaultOpt = function ({ options, name, defValue }) {
  if (defValue === undefined) { return options; }

  const recursiveOpt = getRecursiveOpt({ options, name, defValue });
  if (recursiveOpt) { return recursiveOpt; }

  const option = options[name];
  if (option !== undefined) { return options; }

  return { ...options, [name]: defValue };
};

// Recursion over objects, i.e. when name contains dots
const getRecursiveOpt = function ({ options, name, defValue }) {
  const [parent, ...children] = name.split('.');
  if (children.length === 0) { return; }

  const val = applyDefaultOpt({
    options: options[parent],
    name: children.join('.'),
    defValue,
  });
  return { ...options, [parent]: val };
};

module.exports = {
  applyDefaultOptions,
};
