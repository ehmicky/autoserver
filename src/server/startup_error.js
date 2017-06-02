'use strict';


const { getStandardError, getErrorMessage } = require('../error');


// Handle exceptions thrown at server startup
const handleStartupError = function ({ startupLog }, server, error) {
  const standardError = getStandardError({ log: startupLog, error });
  const message = getErrorMessage({ error: standardError });
  startupLog.error(message, { type: 'failure', errorInfo: standardError });

  // Throws if no listener was setup
  server.emit('error');
};


module.exports = {
  handleStartupError,
};
