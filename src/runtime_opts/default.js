'use strict';

const { defaultsDeep } = require('lodash');

const { getEnvVars } = require('../conf');

// Default value for runtime options
// Priority order:
//  - environment variables
//  - configuration files
//  - default runtime options
const applyDefaultRuntimeOpts = function ({ runtimeOpts }) {
  const envVars = getEnvVars();
  return defaultsDeep({}, envVars, runtimeOpts, defaultRuntimeOpts);
};

const defaultRuntimeOpts = {
  env: 'production',
  maxDataLength: 1000,
  defaultPageSize: 100,
  maxPageSize: 100,
  eventLevel: 'info',
  eventFilter: {
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
  applyDefaultRuntimeOpts,
};
