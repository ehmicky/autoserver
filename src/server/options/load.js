'use strict';

const { throwError } = require('../../error');
const { getConfFile, loadConfFile } = require('../conf');

// Load configuration for `opts`
const loadServerOptsFile = async function ({ serverOptsFile }) {
  try {
    const serverOpts = await getServerOpts({ serverOptsFile });
    return { serverOpts };
  } catch (error) {
    const message = 'Could not load server options file';
    throwError(message, { reason: 'CONF_LOADING', innererror: error });
  }
};

const getServerOpts = async function ({ serverOptsFile }) {
  // When passing `opts` as an object
  if (serverOptsFile && serverOptsFile.constructor === Object) {
    return serverOptsFile;
  }

  // When passing `opts` as a string, or as undefined
  const confFile = await getConfFile({ path: serverOptsFile, name: 'opts' });
  if (!confFile) { return; }

  const content = await loadConfFile({ confFile });
  return content;
};

module.exports = {
  loadServerOptsFile,
};
