'use strict';

const { memoize, deepMerge } = require('../../utilities');

const { processEnv, ENV_VARS_PREFIX, BASIC_NAMES_MAP } = require('./constants');
const { transformEnvVars } = require('./transform');

// Retrieve environment variables related to this project,
// as a normalized object, ready to be used as options
// Environment variables must be prefixed with APIENGINE_*
// They must be uppercased with underscore, e.g. `PAGESIZE` instead of pagesize
// The value will be transtyped, e.g. it can be a number or a boolean
// Nested variables can be indicated with double-underscores,
// e.g. `HTTP_HOSTNAME` becomes `{ http: { hostname } }`
// Array variables can be indicated using `[value,value2,...]` notation.
const getEnvVars = function () {
  return mappers.reduce((envVars, mapper) => mapper({ envVars }), {});
};

// Exclude environment variables not meant for the apiengine
const filterEnvVars = function () {
  return Object.keys(processEnv)
    .filter(name => ENV_VARS_PREFIX.test(name) || BASIC_NAMES_MAP[name]);
};

// Transform to array of `{ name, value }`
const objectifyEnvVars = function ({ envVars }) {
  return envVars.map(name => ({ name, value: processEnv[name] }));
};

// Merge to final output
const mergeAll = function ({ envVars }) {
  const envVarsA = envVars
    .map(({ name, value }) => ({ [name]: value }));
  const envVarsB = deepMerge({}, ...envVarsA);
  return envVarsB;
};

const mappers = [
  filterEnvVars,
  objectifyEnvVars,
  transformEnvVars,
  mergeAll,
];

const mGetEnvVars = memoize(getEnvVars);

module.exports = {
  getEnvVars: mGetEnvVars,
};
