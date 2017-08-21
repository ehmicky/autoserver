'use strict';

const { keepFuncName } = require('../utilities');
const { getStandardError, rethrowError } = require('../error');
const { emitEvent } = require('../events');

const { gracefulExit } = require('./exit');

const handleStartupError = function (func) {
  return async (input, ...args) => {
    try {
      return await func(input, ...args);
    } catch (error) {
      await handleError({ error, input });

      rethrowError(error);
    }
  };
};

const kHandleStartupError = keepFuncName(handleStartupError);

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

  const errorB = await emitEvent({
    type: 'failure',
    phase: 'startup',
    errorInfo: errorA,
    runtimeOpts,
    async: false,
  });

  rethrowError(errorB);
};

module.exports = {
  handleStartupError: kHandleStartupError,
};
