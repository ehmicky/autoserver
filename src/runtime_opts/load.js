'use strict';

const { addErrorHandler } = require('../error');
const { getConfFile, loadConfFile } = require('../conf');
const { deepMerge } = require('../utilities');

// Load configuration for `runtime`
const loadRuntimeOptsFile = async function ({ runtime }) {
  const { runtimeOpts = {}, runtimeOptsFile } = parseRuntimeArg({ runtime });

  // When passing `runtime` as a string, or as undefined
  const runtimeOptsFileA = await getConfFile({
    path: runtimeOptsFile,
    name: 'runtime',
    extNames: ['json', 'yml', 'yaml'],
    useEnvVar: true,
  });
  if (!runtimeOptsFileA) { return { runtimeOpts }; }

  const runtimeOptsA = await loadConfFile({ path: runtimeOptsFileA });

  const runtimeOptsB = deepMerge(runtimeOptsA, runtimeOpts);
  return { runtimeOpts: runtimeOptsB, runtimeOptsFile: runtimeOptsFileA };
};

const eLoadRuntimeOptsFile = addErrorHandler(loadRuntimeOptsFile, {
  message: 'Could not load runtime options file',
  reason: 'CONF_LOADING',
});

const parseRuntimeArg = function ({ runtime }) {
  if (!runtime) { return {}; }

  if (runtime.constructor === Object) {
    return { runtimeOpts: runtime };
  }

  return { runtimeOptsFile: runtime };
};

module.exports = {
  loadRuntimeOptsFile: eLoadRuntimeOptsFile,
};
