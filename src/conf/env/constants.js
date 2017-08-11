'use strict';

// eslint-disable-next-line no-process-env
const processEnv = process.env;

// Common prefix to all environment variables
const ENV_VARS_PREFIX = /^API_ENGINE__/;

// Shortcuts, e.g. environment variable PORT will becomes API_ENGINE__HTTP__PORT
const basicNamesMap = {
  NODE_ENV: 'ENV',
  PORT: 'HTTP__PORT',
  HOST: 'HTTP__HOST',
};

module.exports = {
  processEnv,
  ENV_VARS_PREFIX,
  basicNamesMap,
};
