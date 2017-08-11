'use strict';

const { STATUS_LEVEL_MAP, emitEvent } = require('../../../events');

// Report any exception thrown, for logging/monitoring
const reportError = async function ({ log, error = {}, runtimeOpts }) {
  // If we haven't reached the events middleware yet, error.status
  // will be undefined, so it will still be caught and reported.
  const level = STATUS_LEVEL_MAP[error.status] || 'error';
  // Only report except with level 'warn' or 'error'
  if (!['warn', 'error'].includes(level)) { return; }

  await emitEvent({
    log,
    type: 'failure',
    phase: 'request',
    level,
    info: { errorInfo: error },
    runtimeOpts,
  });
};

module.exports = {
  reportError,
};
