'use strict';

const { defaultsDeep } = require('lodash');

const { getEnvVars } = require('../env');

// Default value for main options
// Priority order:
//  - environment variables
//  - configuration files
//  - default options
const applyDefaultOptions = function ({ serverOpts }) {
  const envVars = getEnvVars();
  return defaultsDeep({}, envVars, serverOpts, defaultOptions);
};

const defaultOptions = {
  env: 'production',
  maxDataLength: 1000,
  defaultPageSize: 100,
  maxPageSize: 100,
  logLevel: 'info',
  logFilter: {
    payload: ['id'],
    response: ['id'],
    argData: ['id'],
    actionResponses: ['id'],
    headers: false,
    queryVars: false,
    params: false,
    settings: false,
  },
  http: {
    enabled: true,
    host: 'localhost',
    port: 80,
  },
};

module.exports = {
  applyDefaultOptions,
};
