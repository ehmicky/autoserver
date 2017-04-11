'use strict';


const yaml = require('js-yaml');

const { EngineStartupError } = require('../error');
const { getYaml } = require('../utilities');


/**
 * Retrieve the configuration using either:
 *  - a filename pointing to a JSON or YAML file
 *  - directly a JavaScript object
 **/
const getIdlConf = async function ({ conf }) {
  if (typeof conf === 'string') {
    try {
      return await getYaml({ path: conf });
    } catch ({ message }) {
      throw new EngineStartupError(message, { reason: 'CONFIGURATION_LOADING' });
    }
  } else if (conf && conf.constructor === Object) {
    return conf;
  } else {
    throw new EngineStartupError('Missing configuration file or \'conf\' option', { reason: 'CONFIGURATION_LOADING' });
  }
};


module.exports = {
  getIdlConf,
};
