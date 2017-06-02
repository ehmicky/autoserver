'use strict';


const { getReason } = require('../../../error');
const { STATUS_LEVEL_MAP } = require('../../../logging');


// Main request logging middleware.
// Each request creates exactly one log, whether successful or not,
// unless it crashed very early (i.e. before this middleware), in which case
// it will still be handled by the error logging middleware.
const logger = function () {
  return async function httpLogger(input) {
    try {
      const response = await this.next(input);

      handleLog({ input });

      return response;
    } catch (error) {
      addErrorReason({ error, input });
      handleLog({ error, input });

      throw error;
    }
  };
};

const handleLog = function ({
  error,
  input: { log, status = 'SERVER_ERROR' },
}) {
  // If input.status is already set, reuse it
  const level = error
    // If an error was thrown, level should always be 'warn' or 'error'
    ? (status === 'CLIENT_ERROR' ? 'warn' : 'error')
    : (STATUS_LEVEL_MAP[status] || 'error');
  // The logger will build the message and the `requestInfo`
  // We do not do it now, because we want the full protocol layer to end first,
  // do `requestInfo` is full.
  log[level]('', { type: 'call' });
};

// Add information for `requestInfo.error`
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
