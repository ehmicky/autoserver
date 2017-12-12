'use strict';

const { throwError } = require('../../../error');

// Starts connection
const connect = function ({ config, options: { data } }) {
  validateEnv({ config });

  return data;
};

const validateEnv = function ({ config: { env } }) {
  if (env === 'dev') { return; }

  const message = 'Memory database must not be used in production, i.e. \'config.env\' must be equal to \'dev\'';
  throwError(message, { reason: 'CONF_VALIDATION' });
};

module.exports = {
  connect,
};
