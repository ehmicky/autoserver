'use strict';


const { getReason } = require('../../../error');


// Main request logging middleware.
// Each request creates exactly one log, whether successful or not,
// unless it crashed very early (i.e. before this middleware), in which case
// it will still be handled by the error logging middleware.

// TODO: explanation comments here
const logger = function () {
  return async function httpLogger(input) {
    try {
      const response = await this.next(input);

      handleLog({ input });

      return response;
    } catch (error) {

      addErrorReason({ error, input });
      handleLog({ input });

      throw error;
    }
  };
};

const handleLog = function ({ input: { logInfo, status = 'SERVER_ERROR' } }) {
  const level = levelMap[status] || 'error';
  logInfo[level]('', { type: 'request' });
};

const levelMap = {
  INTERNALS: 'debug',
  SUCCESS: 'log',
  CLIENT_ERROR: 'warn',
  SERVER_ERROR: 'error',
};

const addErrorReason = function ({ error, input: { logInfo } }) {
  if (!(error instanceof Error)) {
    error = new Error(String(error));
  }

  const errorReason = getReason({ error });
  logInfo.add({ errorReason });
};


module.exports = {
  logger,
};
