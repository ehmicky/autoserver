'use strict';

const { defaultsDeep } = require('lodash');

const { getEnvVars } = require('../conf');
const { ALL_TYPES } = require('../events');
const { assignObject } = require('../utilities');

// Default value for runtime options
// Priority order:
//  - environment variables
//  - configuration files
//  - default runtime options
const applyDefaultRuntimeOpts = function ({ runtimeOpts }) {
  const envVars = getEnvVars();
  const runtimeOptsA = defaultsDeep(
    {},
    envVars,
    runtimeOpts,
    defaultRuntimeOpts,
  );
  return { runtimeOpts: runtimeOptsA };
};

const events = ALL_TYPES
  .map(type => ({ [type]: undefined }))
  .reduce(assignObject, {});

const defaultRuntimeOpts = {
  env: 'production',
  maxDataLength: 1000,
  defaultPageSize: 100,
  maxPageSize: 100,
  events,
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
