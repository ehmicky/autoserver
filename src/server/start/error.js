'use strict';

const { getStandardError, rethrowError } = require('../../error');
const { emitEvent } = require('../../events');

// Handle exceptions thrown at server startup
const handleStartupError = async function ({ error, runtimeOpts }) {
  const errorA = getStandardError({ error });

  const info = { errorInfo: errorA };
  await emitEvent({ type: 'failure', phase: 'startup', info, runtimeOpts });

  rethrowError(errorA);
};

module.exports = {
  handleStartupError,
};
