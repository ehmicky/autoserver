'use strict';

const { rethrowError } = require('../error');
const { emitEvent } = require('../events');

// Handle exceptions thrown at server startup
const handleStartupError = async function (
  error,
  { gracefulExit, protocols, dbAdapters, runOpts, schema },
) {
  // Make sure servers are properly closed if an exception is thrown at end
  // of startup, e.g. during start event handler
  if (gracefulExit) {
    await gracefulExit({ protocols, dbAdapters, runOpts });
  }

  await emitEvent({
    type: 'failure',
    phase: 'startup',
    vars: { error },
    runOpts,
    schema,
  });

  rethrowError(error);
};

module.exports = {
  handleStartupError,
};
