'use strict';

const { getStandardError, rethrowError } = require('../../error');
const { reportLog } = require('../../logging');
const { emitEventAsync } = require('../../events');

// Handle exceptions thrown at server startup
const handleStartupError = async function ({ error, log, apiServer }) {
  const errorA = getStandardError({ log, error });

  await reportLog({ log, type: 'failure', info: { errorInfo: errorA } });

  // Also stops servers if some were started
  await emitEventAsync({ apiServer, name: 'start.failure', data: errorA });

  rethrowError(errorA);
};

module.exports = {
  handleStartupError,
};
