'use strict';

const { throwError } = require('../../../error');

// Starts connection
const connect = function ({ schema, options: { data: { content = {} } } }) {
  validateEnv({ schema });

  return content;
};

const validateEnv = function ({ schema: { env } }) {
  if (env === 'dev') { return; }

  const message = 'Memory database must not be used in production, i.e. option \'env\' must be equal to \'dev\'';
  throwError(message, { reason: 'CONF_VALIDATION' });
};

module.exports = {
  connect,
};
