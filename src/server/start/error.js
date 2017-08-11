'use strict';

const { getStandardError, rethrowError } = require('../../error');
const { reportLog } = require('../../logging');

// Handle exceptions thrown at server startup
const handleStartupError = async function ({ error, log, apiServer }) {
  const errorA = getStandardError({ log, error });

  await reportLog({ log, type: 'failure', info: { errorInfo: errorA } });

  // Also stops servers if some were started
  if (apiServer.exit) {
    await apiServer.exit();
  }

  rethrowError(errorA);
};

module.exports = {
  handleStartupError,
};
