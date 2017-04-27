'use strict';


const { dirname } = require('path');

const { EngineStartupError } = require('../error');
const { getYaml, fs: { realpathAsync } } = require('../utilities');


/**
 * Retrieve the configuration using either:
 *  - a filename pointing to a JSON or YAML file
 *  - directly a JavaScript object
 **/
const getIdlConf = async function ({ conf }) {
  let idl, baseDir;

  if (typeof conf === 'string') {
    let path;
    try {
      path = await realpathAsync(conf);
    } catch (innererror) {
      throw new EngineStartupError(`Configuration file does not exist: ${conf}`, {
        reason: 'CONFIGURATION_LOADING',
        innererror,
      });
    }

    // Remember IDL file directory, so it can be used for $ref path resolution
    baseDir = dirname(path);

    try {
      idl = await getYaml({ path });
    } catch (innererror) {
      throw new EngineStartupError('Could not load configuration file', { reason: 'CONFIGURATION_LOADING', innererror });
    }
  } else if (conf && conf.constructor === Object) {
    idl = conf;
  } else {
    throw new EngineStartupError('Missing configuration file or \'conf\' option', { reason: 'CONFIGURATION_LOADING' });
  }

  return { idl, baseDir };
};


module.exports = {
  getIdlConf,
};
