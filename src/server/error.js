'use strict';


const {
  EngineStartupError,
  getReason,
  getStandardError,
  getErrorMessage,
} = require('../error');


// Handle exceptions thrown at server startup
const handleStartupError = function ({ startupLog }, error) {
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

  const standardError = getStandardError({ log: startupLog, error });
  const message = getErrorMessage({ error: standardError });
  startupLog.error(message, { type: 'failure', errorInfo: standardError });

  // Startup error are rethrown, as opposed to request errors which are handled
  throw standardError;
};


module.exports = {
  handleStartupError,
};
