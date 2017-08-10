'use strict';

const { throwError } = require('../error');
const { getIdl } = require('../idl');

const { getConfFile } = require('./conf');

const loadIdlFile = async function ({ idlFile }) {
  const idlPath = await getIdlPath({ idlFile });

  if (!idlPath) {
    const message = 'Could not find any IDL file';
    throwError(message, { reason: 'CONF_LOADING' });
  }

  return loadIdl({ idlPath });
};

const getIdlPath = async function ({ idlFile }) {
  try {
    return await getConfFile({ path: idlFile, name: 'idl' });
  } catch (error) {
    const message = 'Could not load IDL file';
    throwError(message, { reason: 'CONF_LOADING', innererror: error });
  }
};

const loadIdl = async function ({ idlPath }) {
  try {
    return await getIdl({ idlPath });
  } catch (error) {
    const message = 'Could not load IDL file';
    throwError(message, { reason: 'CONF_LOADING', innererror: error });
  }
};

module.exports = {
  loadIdlFile,
};
