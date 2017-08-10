'use strict';

const { memoize, fusionMerge } = require('../../../utilities');

const { processEnv, ENV_VARS_PREFIX, basicNamesMap } = require('./constants');
const { transformEnvVars } = require('./transform');

// Retrieve environment variables related to this project,
// as a normalized object, ready to be used as `serverOpts`.
// Environment variables must be prefixed with API_ENGINE__*
// They must be uppercased with underscore, e.g. `PAGE_SIZE` instead of pageSize
// The value will be transtyped, e.g. it can be a number or a boolean
// Nested variables can be indicated with double-underscores,
// e.g. `HTTP__HOST` becomes `{ http: { host } }`
// Array variables can be indicated the same way, but with indexes,
// e.g. `ARRAY__0`, `ARRAY__1`, etc.
const getEnvVars = function () {
  return mappers.reduce(
    (envVars, mapper) => mapper({ envVars }),
    {},
  );
};

// Exclude environment variables not meant for the api-engine
const filterEnvVars = function () {
  return Object.keys(processEnv)
    .filter(name => ENV_VARS_PREFIX.test(name) || basicNamesMap[name]);
};

// Transform to array of `{ name, value }`
const objectifyEnvVars = function ({ envVars }) {
  return envVars.map(name => ({ name, value: processEnv[name] }));
};

// Merge to final output
const mergeAll = function ({ envVars }) {
  const envVarsA = envVars
    .map(({ name, value }) => ({ [name]: value }));
  const envVarsB = fusionMerge(...envVarsA);
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
