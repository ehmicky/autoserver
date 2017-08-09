'use strict';

const {
  getStandardError,
  getErrorMessage,
  rethrowError,
} = require('../../error');
const { reportLog } = require('../../logging');
const { emitEventAsync } = require('../../events');

// Handle exceptions thrown at server startup
const handleStartupError = async function ({ error, log, apiServer }) {
  const standardError = getStandardError({ log, error });
  const message = getErrorMessage({ error: standardError });

  await reportLog({
    log,
    level: 'error',
    message,
    info: { type: 'failure', errorInfo: standardError },
  });

  // Also stops servers if some were started
  await emitEventAsync({
    apiServer,
    name: 'start.failure',
    data: standardError,
  });

  rethrowError(standardError);
};

module.exports = {
  handleStartupError,
};
