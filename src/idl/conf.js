'use strict';


const { readFileSync } = require('fs');
const yaml = require('js-yaml');

const { EngineStartupError } = require('../error');


const getIdlConf = function ({ conf }) {
  if (typeof conf === 'string') {
    const idlContent = readFileSync(conf, { encoding: 'utf-8' });
    return yaml.load(idlContent);
  } else if (conf && conf.constructor === Object) {
    return conf;
  } else {
    throw new EngineStartupError('Missing configuration file or \'conf\' option', { reason: 'MISSING_OPTION' });
  }
};


module.exports = {
  getIdlConf,
};
