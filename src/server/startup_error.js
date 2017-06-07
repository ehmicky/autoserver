'use strict';


const { getStandardError, getErrorMessage } = require('../error');


// Handle exceptions thrown at server startup
const handleStartupError = async function ({ startupLog }, apiServer, error) {
  const perf = startupLog.perf.start('mainHandler', 'exception');

  const standardError = getStandardError({ log: startupLog, error });

  try {
    const message = getErrorMessage({ error: standardError });
    await startupLog.error(message, {
      type: 'failure',
      errorInfo: standardError,
    });
  } catch (error) {/* */}

  try {
    perf.stop();
    await startupLog.perf.report();
  } catch (error) {/* */}

  // Throws if no listener was setup
  await apiServer.emitAsync('error', standardError);
};


module.exports = {
  handleStartupError,
};
