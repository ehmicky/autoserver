'use strict';

const { getStandardError, rethrowError } = require('../../error');
const { gracefulExit } = require('../exit');
const { emitEvent } = require('../../events');

const handleStartupError = function (func) {
  // `func.name` is used to keep the function name,
  // because the performance monitoring needs it
  return ({
    [func.name]: async (input, ...args) => {
      try {
        return await func(input, ...args);
      } catch (error) {
        await handleError({ error, input });

        rethrowError(error);
      }
    },
  })[func.name];
};

// Handle exceptions thrown at server startup
const handleError = async function ({
  error,
  input: { servers, runtimeOpts },
}) {
  // Make sure servers are properly closed if an exception is thrown at end
  // of startup, e.g. during start event handler
  if (servers) {
    // Using `await` seems to crash Node.js here
    gracefulExit({ servers, runtimeOpts })
      .catch(error);
  }

  const errorA = getStandardError({ error });

  await emitEvent({
    type: 'failure',
    phase: 'startup',
    errorInfo: errorA,
    runtimeOpts,
  });

  rethrowError(errorA);
};

module.exports = {
  handleStartupError,
};
