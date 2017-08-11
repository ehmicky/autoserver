'use strict';

const { throwError } = require('../../error');
const { getIdl } = require('../../idl');
const { getConfFile } = require('../../conf');

// Load configuration for `idl`
const loadIdlFile = async function ({ idlFile }) {
  const { idl } = await loadIdl({ idlFile });

  if (!idl) {
    const message = 'Could not find any IDL file';
    throwError(message, { reason: 'CONF_LOADING' });
  }

  return { idl };
};

const loadIdl = async function ({ idlFile }) {
  try {
    const { idl } = await getIdlFile({ idlFile });
    return { idl };
  } catch (error) {
    const message = `Could not load IDL file '${idlFile}'`;
    throwError(message, { reason: 'CONF_LOADING', innererror: error });
  }
};

const getIdlFile = async function ({ idlFile }) {
  const idlPath = await getConfFile({ path: idlFile, name: 'idl' });
  if (!idlPath) { return {}; }

  const idl = await getIdl({ idlPath });
  return { idl };
};

module.exports = {
  loadIdlFile,
};
