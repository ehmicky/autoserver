'use strict';

const { STATUS_LEVEL_MAP } = require('../../../logging');
const { getErrorMessage } = require('../../../error');

// Report any exception thrown, for logging/monitoring
const reportError = async function ({ log, error = {} }) {
  // If we haven't reached the request logging middleware yet, error.status
  // will be undefined, so it will still be caught and reported.
  const level = STATUS_LEVEL_MAP[error.status] || 'error';
  // Only report except with level 'warn' or 'error'
  if (!['warn', 'error'].includes(level)) { return; }

  const message = getErrorMessage({ error });
  await log[level](message, { type: 'failure', errorInfo: error });
};

module.exports = {
  reportError,
};
