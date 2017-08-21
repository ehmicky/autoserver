'use strict';

const { defaultsDeep } = require('lodash');

const { omit } = require('../../utilities');

const { getEnvVars } = require('./get');

// Apply environment variables. They have highest priority
const applyEnvVars = function ({ options }) {
  const envVars = getEnvVars();

  // This was already handled
  const envVarsA = omit(envVars, 'config');

  const optionsA = defaultsDeep({}, envVarsA, options);

  return { options: optionsA };
};

module.exports = {
  applyEnvVars,
};
