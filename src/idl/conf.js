'use strict';


const { readFileSync } = require('fs');
const yaml = require('js-yaml');

const { EngineStartupError } = require('../error');


/**
 * Retrieve the configuration using either:
 *  - a filename pointing to a JSON or YAML file
 *  - directly a JavaScript object
 **/
const getIdlConf = function ({ conf }) {
  if (typeof conf === 'string') {
    const path = conf;
    const content = getIdlContent({ path });
    const data = getIdlData({ content, path });
    return data;
  } else if (conf && conf.constructor === Object) {
    return conf;
  } else {
    throw new EngineStartupError('Missing configuration file or \'conf\' option', { reason: 'CONFIGURATION_LOADING' });
  }
};

const getIdlContent = function ({ path }) {
  try {
    return readFileSync(path, { encoding: 'utf-8' });
  } catch (exception) {
    throw new EngineStartupError(exception.message, { reason: 'CONFIGURATION_LOADING' });
  }
};

const getIdlData = function ({ content, path }) {
  try {
    return yaml.load(content, {
      // YAML needs to JSON-compatible, since JSON must provide same features as YAML
      schema: yaml.CORE_SCHEMA,
      json: true,
      // Error handling
      filename: path,
      onWarning(exception) {
        throwIdlDataError(exception);
      },
    });
  } catch (exception) {
    throwIdlDataError(exception);
  }
};

const throwIdlDataError = function (exception) {
  let message = exception.message;
  if (exception instanceof yaml.YAMLException) {
    message = `Syntax error in configuration file, ${message}`;
  }
  throw new EngineStartupError(message, { reason: 'CONFIGURATION_LOADING' });
};


module.exports = {
  getIdlConf,
};
