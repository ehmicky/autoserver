'use strict';

const { throwError } = require('../error');
const { getConfFile, loadConfFile } = require('../conf');

// Load configuration for `runtime`
const loadRuntimeOptsFile = async function ({ runtimeOptsFile }) {
  try {
    const {
      runtimeOpts,
      runtimeOptsFile: runtimeOptsFileA,
    } = await getRuntimeOpts({ runtimeOptsFile });
    return { runtimeOpts, runtimeOptsFile: runtimeOptsFileA };
  } catch (error) {
    const message = `Could not load runtime options file '${runtimeOptsFile}'`;
    throwError(message, { reason: 'CONF_LOADING', innererror: error });
  }
};

const getRuntimeOpts = async function ({ runtimeOptsFile }) {
  // When passing `runtime` as an object
  if (runtimeOptsFile && runtimeOptsFile.constructor === Object) {
    return { runtimeOpts: runtimeOptsFile };
  }

  // When passing `runtime` as a string, or as undefined
  const runtimeOptsFileA = await getConfFile({
    path: runtimeOptsFile,
    name: 'runtime',
    extNames: ['json', 'yml', 'yaml'],
    useEnvVar: true,
  });
  if (!runtimeOptsFileA) { return {}; }

  const runtimeOpts = await loadConfFile({ path: runtimeOptsFileA });
  return { runtimeOpts, runtimeOptsFile: runtimeOptsFileA };
};

module.exports = {
  loadRuntimeOptsFile,
};
