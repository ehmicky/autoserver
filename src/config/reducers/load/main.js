'use strict';

const { deepMerge } = require('../../../utilities');
const { dereferenceRefs } = require('../../../json_refs');

const { getEnvVars } = require('./env');
const { getConfPath } = require('./path');

// Load config file
const loadFile = async function ({ configPath, config: configOpts }) {
  const { config: envConfigPath, ...envVars } = getEnvVars();

  const path = await getConfPath({ envConfigPath, configPath });

  const configFile = await dereferenceRefs({ path });

  // Priority order: environment variables > Node.js/CLI options > config file
  const config = deepMerge(configFile, configOpts, envVars);

  return config;
};

module.exports = {
  loadFile,
};
