'use strict';

const { getStandardError, rethrowError } = require('../../error');
const { gracefulExit } = require('../exit');
const { emitEvent } = require('../../events');

// Error handling
const handleStartupError = function (func) {
  return async function wrappedFunc (input) {
    try {
      return await func(input);
    } catch (error) {
      await handleError({ error });
    }
  };
};

// Handle exceptions thrown at server startup
const handleError = async function ({ error }) {
  const errorA = getStandardError({ error });

  const info = { errorInfo: errorA };
  await emitEvent({ type: 'failure', phase: 'startup', info });

  rethrowError(errorA);
};

// Make sure servers are properly closed if an exception is thrown at end
// of startup, e.g. during start event handler
const handleLateStartupError = function (func) {
  // `func.name` is used to keep the function name,
  // because the performance monitoring needs it
  return ({
    [func.name]: async (...args) => {
      try {
        return await func(...args);
      } catch (error) {
        const [{ servers, runtimeOpts }] = args;
        // Using `await` seems to crash Node.js here
        gracefulExit({ servers, runtimeOpts })
          .catch(error);

        rethrowError(error);
      }
    },
  })[func.name];
};

module.exports = {
  handleStartupError,
  handleLateStartupError,
};
