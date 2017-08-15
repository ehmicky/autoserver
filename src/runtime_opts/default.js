'use strict';

const { defaultsDeep } = require('lodash');

const { getEnvVars } = require('../conf');
const { omit } = require('../utilities');

const availableRuntimeOpts = require('./available');

// Default value for runtime options
// Priority order:
//  - environment variables
//  - configuration files
//  - default runtime options
const applyDefaultRuntimeOpts = function ({ runtimeOpts }) {
  const runtimeOptsA = applyEnvVars({ runtimeOpts });
  const runtimeOptsB = applyDefaultOpts({ runtimeOpts: runtimeOptsA });
  return { runtimeOpts: runtimeOptsB };
};

// Apply environment variables
const applyEnvVars = function ({ runtimeOpts }) {
  const envVars = getEnvVars();
  // Those are handled elsewhere
  const envVarsA = omit(envVars, ['idl', 'runtime']);

  return defaultsDeep({}, envVarsA, runtimeOpts);
};

// Apply `availableRuntimeOpts` `default` values
const applyDefaultOpts = function ({ runtimeOpts }) {
  return availableRuntimeOpts.reduce(
    (runtimeOptsA, { name, default: defValue }) =>
      applyDefaultOpt({ runtimeOpts: runtimeOptsA, name, defValue }),
    runtimeOpts,
  );
};

const applyDefaultOpt = function ({ runtimeOpts, name, defValue }) {
  if (defValue === undefined) { return runtimeOpts; }

  const recursiveOpt = getRecursiveOpt({ runtimeOpts, name, defValue });
  if (recursiveOpt) { return recursiveOpt; }

  const runtimeOpt = runtimeOpts[name];
  if (runtimeOpt !== undefined) { return runtimeOpts; }

  return { ...runtimeOpts, [name]: defValue };
};

// Recursion over objects, i.e. when name contains dots
const getRecursiveOpt = function ({ runtimeOpts, name, defValue }) {
  const [parent, ...children] = name.split('.');
  if (children.length === 0) { return; }

  const val = applyDefaultOpt({
    runtimeOpts: runtimeOpts[parent],
    name: children.join('.'),
    defValue,
  });
  return { ...runtimeOpts, [parent]: val };
};

module.exports = {
  applyDefaultRuntimeOpts,
};
