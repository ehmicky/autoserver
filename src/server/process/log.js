'use strict';

const { createLog, reportLog } = require('../../logging');
const { getStandardError, normalizeError } = require('../../error');

const getProcessLog = function ({ runtimeOpts, apiServer }) {
  const log = createLog({ runtimeOpts, apiServer, phase: 'process' });
  const processLog = processHandler.bind(null, log);
  return { processLog };
};

// Report process problems as logs with type 'failure'
const processHandler = async function (log, { error, message }) {
  const errorA = normalizeError({ error, message, reason: 'PROCESS_ERROR' });
  const errorB = getStandardError({ log, error: errorA });

  await reportLog({ log, type: 'failure', info: { errorInfo: errorB } });
};

module.exports = {
  getProcessLog,
};
