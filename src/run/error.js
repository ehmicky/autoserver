'use strict';

const { rethrowError } = require('../error');
const { logEvent } = require('../log');

// Handle exceptions thrown at server startup
const handleStartupError = async function (
  error,
  { exitFunc, protocols, dbAdapters, config },
) {
  // Make sure servers are properly closed if an exception is thrown at end
  // of startup, e.g. during start event handler
  if (exitFunc) {
    await exitFunc({ protocols, dbAdapters });
  }

  await logEvent({
    event: 'failure',
    phase: 'startup',
    params: { error },
    config,
  });

  rethrowError(error);
};

module.exports = {
  handleStartupError,
};
