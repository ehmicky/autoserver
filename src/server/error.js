'use strict';


const { EngineStartupError, getReason } = require('../error');


// Handle exceptions thrown at server startup
const handleStartupError = function (error) {
  // Make sure all exceptions thrown at startup follow
  // the EngineStartupError signature
  if (typeof error === 'string') {
    error = new EngineStartupError(error, { reason: 'UNKNOWN' });
  } else if (!(error instanceof EngineStartupError)) {
    const reason = getReason({ error });
    error = new EngineStartupError(error.message, {
      reason,
      innererror: error,
    });
  }

  error.normalize();

  // Startup error are rethrown, as opposed to request errors which are handled
  throw error;
};


module.exports = {
  handleStartupError,
};
