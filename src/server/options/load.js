'use strict';

const { throwError } = require('../../error');
const { getConfFile, loadConfFile } = require('../conf');

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
  const confFile = await getConfFile({ path: serverOptsFile, name: 'opts' });
  if (!confFile) { return; }

  const content = await loadConfFile({ confFile });
  return content;
};

module.exports = {
  loadServerOptsFile,
};
