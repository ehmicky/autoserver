'use strict';

const { addErrorHandler } = require('../error');
const { deepMerge } = require('../utilities');

const { getEnvVars } = require('./env');
const { getConfFile, loadConfFile } = require('./conf');

// Load main configuration file `config`, and merges it with inline options
const loadMainConf = async function ({ options, command }) {
  const {
    options: optionsA = {},
    optionsFile,
  } = await eLoadMainConfFile({ options, command });

  const optionsB = deepMerge(optionsA, options);
  return { options: optionsB, optionsFile };
};

const loadMainConfFile = async function ({ options, command }) {
  const path = getMainConfPath({ options });
  const optionsFile = await getConfFile({
    path,
    name: `${command}.config`,
    extNames: ['json', 'yml', 'yaml'],
  });
  if (!optionsFile) { return {}; }

  const optionsA = await loadConfFile({ type: 'generic', path: optionsFile });
  return { options: optionsA, optionsFile };
};

const getMainConfPath = function ({ options }) {
  const envVars = getEnvVars();
  return envVars.config || options.config;
};

const eLoadMainConfFile = addErrorHandler(loadMainConfFile, {
  message: 'Could not load options configuration file \'config\'',
  reason: 'CONF_LOADING',
});

module.exports = {
  loadMainConf,
};
