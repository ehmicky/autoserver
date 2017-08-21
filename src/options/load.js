'use strict';

const { addErrorHandler } = require('../error');
const { getConfFile, loadConfFile } = require('../conf');
const { deepMerge } = require('../utilities');

// Load configuration for `config`
const loadOptionsConfig = async function ({
  config,
  availableOpts: { topLevel },
}) {
  const { options = {}, optionsFile } = parseConfigArg({ config });

  // When passing `config` as a string, or as undefined
  const optionsFileA = await getConfFile({
    path: optionsFile,
    name: topLevel,
    extNames: ['json', 'yml', 'yaml'],
    useEnvVar: true,
  });
  if (!optionsFileA) { return { options }; }

  const optionsA = await loadConfFile({ type: 'generic', path: optionsFileA });

  const optionsB = deepMerge(optionsA, options);
  return { options: optionsB, optionsFile: optionsFileA };
};

const eLoadOptionsConfig = addErrorHandler(loadOptionsConfig, {
  message: ({ configName }) => `Could not load options configuration file ${configName}`,
  reason: 'CONF_LOADING',
});

const parseConfigArg = function ({ config }) {
  if (!config) { return {}; }

  if (config.constructor === Object) {
    return { options: config };
  }

  return { optionsFile: config };
};

module.exports = {
  loadOptionsConfig: eLoadOptionsConfig,
};
