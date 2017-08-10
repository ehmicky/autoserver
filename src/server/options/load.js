'use strict';

const { throwError } = require('../../error');
const { getConf } = require('../conf');

const loadServerOptsFile = async function ({ serverOptsFile }) {
  try {
    const serverOpts = await getConf({ path: serverOptsFile, name: 'opts' });
    return { serverOpts };
  } catch (error) {
    const message = 'Could not load server options file';
    throwError(message, { reason: 'CONF_LOADING', innererror: error });
  }
};

module.exports = {
  loadServerOptsFile,
};
