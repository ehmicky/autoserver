'use strict';

const { throwError } = require('../error');
const { getConfFile, loadConfFile } = require('../conf');

// Load configuration for `runtime`
const loadRuntimeOptsFile = async function ({ runtimeOptsFile }) {
  try {
    const runtimeOpts = await getRuntimeOpts({ runtimeOptsFile });
    return { runtimeOpts };
  } catch (error) {
    const message = 'Could not load runtime options file';
    throwError(message, { reason: 'CONF_LOADING', innererror: error });
  }
};

const getRuntimeOpts = async function ({ runtimeOptsFile }) {
  // When passing `runtime` as an object
  if (runtimeOptsFile && runtimeOptsFile.constructor === Object) {
    return runtimeOptsFile;
  }

  // When passing `runtime` as a string, or as undefined
  const confFile = await getConfFile({
    path: runtimeOptsFile,
    name: 'runtime',
  });
  if (!confFile) { return; }

  const content = await loadConfFile({ confFile });
  return content;
};

module.exports = {
  loadRuntimeOptsFile,
};
