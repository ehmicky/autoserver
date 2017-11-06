'use strict';

const { addGenErrorHandler } = require('../error');
const { generic } = require('../formats');
const { deepMerge } = require('../utilities');

const { getEnvVars } = require('./env');
const { getConfFile } = require('./conf');

// Load main configuration file `config`, and merges it with inline options
const loadMainConf = async function ({ options, instruction }) {
  const {
    options: optionsA = {},
    mainConfPath,
  } = await eLoadMainConfFile({ options, instruction });

  const optionsB = deepMerge(optionsA, options);
  return { options: optionsB, mainConfPath };
};

const loadMainConfFile = async function ({ options, instruction }) {
  const mainConfPath = getMainConfPath({ options });
  const { path: mainConfPathA, content } = await getConfFile({
    path: mainConfPath,
    name: `${instruction}.config`,
    extNames: generic.extNames,
    loader: 'generic',
  });
  return { options: content, mainConfPath: mainConfPathA };
};

const eLoadMainConfFile = addGenErrorHandler(loadMainConfFile, {
  message: 'Could not load \'config\' file',
  reason: 'CONF_LOADING',
});

// Main configuration file can be specified with `config` option,
// or APIENGINE_CONFIG environment variable, or by looked in the tree
// under filename `apiengine.INSTRUCTION.config.EXT`
const getMainConfPath = function ({ options }) {
  const envVars = getEnvVars();
  return envVars.config || options.config;
};

module.exports = {
  loadMainConf,
};
