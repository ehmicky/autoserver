'use strict';

// eslint-disable-next-line no-process-env
const processEnv = process.env;

// Common prefix to all environment variables
const ENV_VARS_PREFIX = /^API_ENGINE__/;

// Shortcuts, e.g. environment variable PORT will becomes API_ENGINE__HTTP__PORT
const BASIC_NAMES_MAP = {
  NODE_ENV: 'ENV',
  PORT: 'HTTP__PORT',
  HOST: 'HTTP__HOSTNAME',
};

module.exports = {
  processEnv,
  ENV_VARS_PREFIX,
  BASIC_NAMES_MAP,
};
