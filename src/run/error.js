'use strict';

const { getStandardError, rethrowError } = require('../error');
const { emitEvent } = require('../events');

const { gracefulExit } = require('./exit');

// Handle exceptions thrown at server startup
const handleStartupError = async function (error, { servers, runOpts }) {
  // Make sure servers are properly closed if an exception is thrown at end
  // of startup, e.g. during start event handler
  if (servers) {
    await gracefulExit({ servers, runOpts });
  }

  const errorA = getStandardError({ error });

  const errorB = await emitEvent({
    type: 'failure',
    phase: 'startup',
    errorInfo: errorA,
    runOpts,
    async: false,
  });

  rethrowError(errorB);
};

module.exports = {
  handleStartupError,
};
