'use strict';


const { getStandardError, getErrorMessage } = require('../error');


// Handle exceptions thrown at server startup
const handleStartupError = function ({ startupLog }, apiServer, error) {
  const perf = startupLog.perf.start('mainHandler', 'exception');

  const standardError = getStandardError({ log: startupLog, error });
  const message = getErrorMessage({ error: standardError });
  startupLog.error(message, { type: 'failure', errorInfo: standardError });

  perf.stop();
  startupLog.perf.report();

  // Throws if no listener was setup
  apiServer.emit('error');
};


module.exports = {
  handleStartupError,
};
