'use strict';


// Map a request status to a log level
const STATUS_LEVEL_MAP = {
  INTERNALS: 'debug',
  SUCCESS: 'log',
  CLIENT_ERROR: 'warn',
  SERVER_ERROR: 'error',
};


module.exports = {
  STATUS_LEVEL_MAP,
};
