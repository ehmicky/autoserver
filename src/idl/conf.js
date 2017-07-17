'use strict';

const { dirname } = require('path');
const { realpath } = require('fs');
const { promisify } = require('util');

const { EngineError } = require('../error');
const { getYaml } = require('../utilities');

/**
 * Retrieve the configuration using either:
 *  - a filename pointing to a JSON or YAML file
 *  - directly a JavaScript object
 **/
const getIdlConf = async function ({ conf }) {
  let idl;
  let baseDir;

  if (typeof conf === 'string') {
    let path;

    try {
      path = await promisify(realpath)(conf);
    } catch (error) {
      const message = `Configuration file does not exist: '${conf}'`;
      throw new EngineError(message, {
        reason: 'CONFIGURATION_LOADING',
        innererror: error,
      });
    }

    // Remember IDL file directory, so it can be used for $ref path resolution
    baseDir = dirname(path);

    try {
      idl = await getYaml({ path });
    } catch (error) {
      const message = 'Could not load configuration file';
      throw new EngineError(message, {
        reason: 'CONFIGURATION_LOADING',
        innererror: error,
      });
    }
  } else if (conf && conf.constructor === Object) {
    idl = conf;
  } else {
    const message = 'Missing configuration file or \'conf\' option';
    throw new EngineError(message, { reason: 'CONFIGURATION_LOADING' });
  }

  return { idl, baseDir };
};

module.exports = {
  getIdlConf,
};
