'use strict';

const { STATUS_LEVEL_MAP, emitEvent } = require('../../../events');

// Report any exception thrown
const reportError = async function ({
  input: { reqInfo, runtimeOpts },
  error = {},
}) {
  // If we haven't reached the events middleware yet, error.status
  // will be undefined, so it will still be caught and reported.
  const level = STATUS_LEVEL_MAP[error.status] || 'error';
  // Only report except with level 'warn' or 'error'
  if (!['warn', 'error'].includes(level)) { return; }

  await emitEvent({
    reqInfo,
    type: 'failure',
    phase: 'request',
    level,
    errorInfo: error,
    runtimeOpts,
  });
};

module.exports = {
  reportError,
};
