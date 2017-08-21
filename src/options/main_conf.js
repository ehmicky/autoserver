'use strict';

const { addErrorHandler } = require('../error');
const { getConfFile, loadConfFile } = require('../conf');
const { deepMerge } = require('../utilities');

// Load main configuration file `config`, and merges it with inline options
const loadMainConf = async function ({ options, command }) {
  const {
    options: optionsA = {},
    optionsFile,
  } = await eLoadMainConfFile({ options, command });

  const optionsB = deepMerge(optionsA, options);
  return { options: optionsB, optionsFile };
};

const loadMainConfFile = async function ({ options: { config }, command }) {
  const optionsFile = await getConfFile({
    path: config,
    name: `${command}.config`,
    extNames: ['json', 'yml', 'yaml'],
    useEnvVar: true,
  });
  if (!optionsFile) { return {}; }

  const options = await loadConfFile({ type: 'generic', path: optionsFile });
  return { options, optionsFile };
};

const eLoadMainConfFile = addErrorHandler(loadMainConfFile, {
  message: 'Could not load options configuration file \'config\'',
  reason: 'CONF_LOADING',
});

module.exports = {
  loadMainConf,
};
