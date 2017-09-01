'use strict';

const { omit, deepMerge } = require('../../utilities');

const { getEnvVars } = require('./get');

// Apply environment variables. They have highest priority
const applyEnvVars = function ({ options }) {
  const envVars = getEnvVars();

  // `config` environment variable was already handled
  const envVarsA = omit(envVars, 'config');

  const optionsA = deepMerge(options, envVarsA);

  return { options: optionsA };
};

module.exports = {
  applyEnvVars,
};
