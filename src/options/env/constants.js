'use strict';

// eslint-disable-next-line no-process-env
const processEnv = process.env;

// Common prefix to all environment variables
const ENV_VARS_PREFIX = /^APIENGINE_/;

// Shortcuts, e.g. environment variable PORT will becomes APIENGINE_HTTP_PORT
const BASIC_NAMES_MAP = {
  NODE_ENV: 'ENV',
  PORT: 'HTTP_PORT',
  HOST: 'HTTP_HOSTNAME',
};

module.exports = {
  processEnv,
  ENV_VARS_PREFIX,
  BASIC_NAMES_MAP,
};
