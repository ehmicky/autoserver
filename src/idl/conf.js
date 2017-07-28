'use strict';

const { dirname } = require('path');

const { throwError } = require('../error');
const { getYaml, pRealpath } = require('../utilities');

/**
 * Retrieve the configuration using either:
 *  - a filename pointing to a JSON or YAML file
 *  - directly a JavaScript object
 **/
const getIdlConf = async function ({ idl }) {
  if (typeof idl === 'string') {
    const idlConf = await getIdlFromPath({ path: idl });
    return idlConf;
  }

  if (idl && idl.constructor === Object) { return idl; }

  const message = 'Missing configuration file or \'conf\' option';
  throwError(message, { reason: 'CONFIGURATION_LOADING' });
};

const getIdlFromPath = async function ({ path }) {
  const realPath = await getIdlPath({ path });

  // Remember IDL file directory, so it can be used for $ref path resolution
  const baseDir = dirname(realPath);

  try {
    const idl = await getYaml({ path: realPath });
    return { ...idl, baseDir };
  } catch (error) {
    const message = 'Could not load configuration file';
    throwError(message, {
      reason: 'CONFIGURATION_LOADING',
      innererror: error,
    });
  }
};

const getIdlPath = async function ({ path }) {
  try {
    return await pRealpath(path);
  } catch (error) {
    const message = `Configuration file does not exist: '${path}'`;
    throwError(message, {
      reason: 'CONFIGURATION_LOADING',
      innererror: error,
    });
  }
};

module.exports = {
  getIdlConf,
};
