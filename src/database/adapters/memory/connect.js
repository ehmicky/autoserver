'use strict';

const { throwError } = require('../../../error');

const database = require('./data.json');

// Starts connection
const connect = function ({ runOpts }) {
  validateEnv({ runOpts });

  return database;
};

const validateEnv = function ({ runOpts }) {
  if (runOpts.env === 'dev') { return; }

  const message = 'Memory database must not be used in production, i.e. option \'env\' must be equal to \'dev\'';
  throwError(message, { reason: 'CONF_VALIDATION' });
};

module.exports = {
  connect,
};
