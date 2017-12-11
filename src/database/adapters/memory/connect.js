'use strict';

const { throwError } = require('../../../error');

// Starts connection
const connect = function ({ schema, options: { data } }) {
  validateEnv({ schema });

  return data;
};

const validateEnv = function ({ schema: { env } }) {
  if (env === 'dev') { return; }

  const message = 'Memory database must not be used in production, i.e. \'schema.env\' must be equal to \'dev\'';
  throwError(message, { reason: 'SCHEMA_VALIDATION' });
};

module.exports = {
  connect,
};
