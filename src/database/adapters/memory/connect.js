'use strict';

// Starts connection
const connect = function ({ config, options: { data } }) {
  validateEnv({ config });

  return data;
};

const validateEnv = function ({ config: { env } }) {
  if (env === 'dev') { return; }

  const message = 'Memory database must not be used in production, i.e. \'config.env\' must be equal to \'dev\'';
  // eslint-disable-next-line fp/no-throw
  throw new Error(message);
};

module.exports = {
  connect,
};
