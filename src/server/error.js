'use strict';


const { getStandardError, getErrorMessage } = require('../error');


// Handle exceptions thrown at server startup
const handleStartupError = function ({ startupLog }, error) {
  const standardError = getStandardError({ log: startupLog, error });
  const message = getErrorMessage({ error: standardError });
  startupLog.error(message, { type: 'failure', errorInfo: standardError });

  // Startup error are rethrown, as opposed to request errors which are handled
  throw standardError;
};


module.exports = {
  handleStartupError,
};
