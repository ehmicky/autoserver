'use strict';


const { dirname } = require('path');

const { EngineError } = require('../error');
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
      const message = `Configuration file does not exist: '${conf}'`;
      throw new EngineError(message, {
        reason: 'CONFIGURATION_LOADING',
        innererror,
      });
    }

    // Remember IDL file directory, so it can be used for $ref path resolution
    baseDir = dirname(path);

    try {
      idl = await getYaml({ path });
    } catch (innererror) {
      const message = 'Could not load configuration file';
      throw new EngineError(message, {
        reason: 'CONFIGURATION_LOADING',
        innererror,
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
