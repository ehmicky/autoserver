'use strict';

const { createLog, reportLog } = require('../../logging');
const {
  getStandardError,
  getErrorMessage,
  normalizeError,
} = require('../../error');

const getProcessLog = function ({ serverOpts, apiServer }) {
  const log = createLog({ serverOpts, apiServer, phase: 'process' });
  const processLog = processHandler.bind(null, log);
  return { processLog };
};

// Report process problems as logs with type 'failure'
const processHandler = async function (log, { error, message }) {
  const errorA = normalizeError({ error, message, reason: 'PROCESS_ERROR' });
  const errorB = getStandardError({ log, error: errorA });
  const errorMessage = getErrorMessage({ error: errorB });

  await reportLog({
    log,
    level: 'error',
    message: errorMessage,
    info: { type: 'failure', errorInfo: errorB },
  });
};

module.exports = {
  getProcessLog,
};
