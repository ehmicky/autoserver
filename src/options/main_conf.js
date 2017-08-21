'use strict';

const { addErrorHandler } = require('../error');
const { deepMerge } = require('../utilities');

const { getEnvVars } = require('./env');
const { getConfFile } = require('./conf');

// Load main configuration file `config`, and merges it with inline options
const loadMainConf = async function ({ options, command }) {
  const {
    options: optionsA = {},
    mainConfPath,
  } = await eLoadMainConfFile({ options, command });

  const optionsB = deepMerge(optionsA, options);
  return { options: optionsB, mainConfPath };
};

const loadMainConfFile = async function ({ options, command }) {
  const mainConfPath = getMainConfPath({ options });
  const { path: mainConfPathA, content } = await getConfFile({
    path: mainConfPath,
    name: `${command}.config`,
    extNames: ['json', 'yml', 'yaml'],
    loader: 'generic',
  });
  return { options: content, mainConfPath: mainConfPathA };
};

// Main configuration file can be specified with `config` option,
// or API_ENGINE__CONFIG environment variable, or by looked in the tree
// under filename `api_engine.COMMAND.config.json|yml|yaml`
const getMainConfPath = function ({ options }) {
  const envVars = getEnvVars();
  return envVars.config || options.config;
};

const eLoadMainConfFile = addErrorHandler(loadMainConfFile, {
  message: 'Could not load \'config\' file',
  reason: 'CONF_LOADING',
});

module.exports = {
  loadMainConf,
};
