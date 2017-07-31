'use strict';

const { onlyOnce, identity } = require('../utilities');
const { createLog, reportLog } = require('../logging');
const {
  throwError,
  getStandardError,
  getErrorMessage,
  normalizeError,
} = require('../error');

// Error handling for all failures that are process-related
const processErrorHandler = function ({ oServerOpts, apiServer }) {
  checkUniqueCall();

  const processLog = getProcessLog({ oServerOpts, apiServer });
  setupHandlers({ processLog });

  return { processLog };
};

// Since `startServer()` manipulates process, e.g. by intercepting signals
// or calling process.exit(), we consider it owns it, which implies:
//   - only once instance of this engine per process
//   - this engine cannot share a process with other significant modules/parts
const checkUniqueCall = function () {
  try {
    uniqueCall();
  } catch (error) {
    const message = '\'startServer()\' can only be called once per process.';
    throwError(message, {
      reason: 'PROCESS_ERROR',
      innererror: error,
    });
  }
};

const uniqueCall = onlyOnce(identity, { error: true });

const getProcessLog = function ({ oServerOpts, apiServer }) {
  const log = createLog({
    serverOpts: oServerOpts,
    apiServer,
    phase: 'process',
  });
  const processLog = processHandler.bind(null, log);
  return processLog;
};

const setupHandlers = function ({ processLog }) {
  setupUnhandledRejection({ processLog });
  setupRejectionHandled({ processLog });
  setupWarning({ processLog });
};

const setupUnhandledRejection = function ({ processLog }) {
  process.on('unhandledRejection', async error => {
    const message = 'A promise was rejected and not handled right away';
    await processLog({ error, message });
  });
};

const setupRejectionHandled = function ({ processLog }) {
  process.on('rejectionHandled', async () => {
    const message = 'A promise was rejected but handled too late';
    await processLog({ message });
  });
};

const setupWarning = function ({ processLog }) {
  process.on('warning', async error => {
    await processLog({ error });
  });
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
  processErrorHandler,
};
