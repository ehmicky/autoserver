'use strict';


const { STATUS_LEVEL_MAP } = require('../../../logging');
const { getErrorMessage } = require('../../../error');


// Report any exception thrown, for logging/monitoring
const reportError = function ({ log, error = {} }) {
  if (!isError({ error })) { return; }

  const message = getErrorMessage({ error });
  log.error(message, { type: 'failure', errorInfo: error });
};

// Only report except with status 'error'
// If we haven't reached the request logging middleware yet, error.status
// will be undefined, so it will still be caught and reporter.
const isError = function ({ error }) {
  const level = STATUS_LEVEL_MAP[error.status];
  return !level || level === 'error';
};


module.exports = {
  reportError,
};
