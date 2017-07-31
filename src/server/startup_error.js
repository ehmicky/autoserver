'use strict';

const { getStandardError, getErrorMessage } = require('../error');
const { reportLog } = require('../logging');
const { emitEventAsync } = require('../events');

// Handle exceptions thrown at server startup
const handleStartupError = async function ({
  error: err,
  startupLog,
  apiServer,
}) {
  const standardError = getStandardError({ log: startupLog, error: err });
  const message = getErrorMessage({ error: standardError });
  await reportLog({
    log: startupLog,
    level: 'error',
    message,
    info: { type: 'failure', errorInfo: standardError },
  });

  // Stops servers if some were started
  try {
    await emitEventAsync({ apiServer, name: 'startupError' });
  } catch (error) {}

  // Throws if no listener was setup
  await emitEventAsync({ apiServer, name: 'error', data: standardError });
};

module.exports = {
  handleStartupError,
};
