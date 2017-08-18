'use strict';

const { throwError, addErrorHandler } = require('../../error');
const { getIdl } = require('../../idl');
const { getConfFile } = require('../../conf');

// Load configuration for `idl`
const loadIdlFile = async function ({ idlFile }) {
  const { idl } = await eLoadIdl({ idlFile });

  if (!idl) {
    const message = 'Could not find any IDL file';
    throwError(message, { reason: 'CONF_LOADING' });
  }

  return { idl };
};

const loadIdl = async function ({ idlFile }) {
  const idlPath = await getConfFile({
    path: idlFile,
    name: 'idl',
    extNames: ['json', 'yml', 'yaml'],
    useEnvVar: true,
  });
  if (!idlPath) { return {}; }

  const idl = await getIdl({ idlPath });
  return { idl };
};

const eLoadIdl = addErrorHandler(loadIdl, {
  message: 'Could not load IDL file',
  reason: 'CONF_LOADING',
});

module.exports = {
  loadIdlFile,
};
