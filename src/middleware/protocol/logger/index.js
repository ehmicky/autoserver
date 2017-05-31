'use strict';


const { getReason } = require('../../../error');
const { STATUS_LEVEL_MAP } = require('../../../logging');


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

const handleLog = function ({ input: { log, status = 'SERVER_ERROR' } }) {
  const level = STATUS_LEVEL_MAP[status] || 'error';
  log[level]('', { type: 'request' });
};

const addErrorReason = function ({ error, input: { log } }) {
  if (!(error instanceof Error)) {
    error = new Error(String(error));
  }

  const errorReason = getReason({ error });
  log.add({ errorReason });
};


module.exports = {
  logger,
};
