'use strict';

const { onlyOnce, identity } = require('../utilities');
const { Log, reportLog } = require('../logging');
const {
  throwError,
  getStandardError,
  getErrorMessage,
  normalizeError,
} = require('../error');

// Error handling for all failures that are process-related
const processErrorHandler = function ({ options: serverOpts, apiServer }) {
  checkUniqueCall();

  const processLog = new Log({ serverOpts, apiServer, phase: 'process' });
  // Shortcut function
  processLog.process = processHandler.bind(null, processLog);

  setupHandlers({ log: processLog });

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

const setupHandlers = function ({ log }) {
  setupUnhandledRejection({ log });
  setupRejectionHandled({ log });
  setupWarning({ log });
};

const setupUnhandledRejection = function ({ log }) {
  process.on('unhandledRejection', async error => {
    const message = 'A promise was rejected and not handled right away';
    await log.process({ error, message });
  });
};

const setupRejectionHandled = function ({ log }) {
  process.on('rejectionHandled', async () => {
    const message = 'A promise was rejected but handled too late';
    await log.process({ message });
  });
};

const setupWarning = function ({ log }) {
  process.on('warning', async error => {
    await log.process({ error });
  });
};

// Report process problems as logs with type 'failure'
const processHandler = async function (log, { error, message }) {
  const errorObj = normalizeError({ error, message, reason: 'PROCESS_ERROR' });
  const standardError = getStandardError({ log, error: errorObj });
  const errorMessage = getErrorMessage({ error: standardError });

  await reportLog({
    log,
    level: 'error',
    message: errorMessage,
    info: { type: 'failure', errorInfo: standardError },
  });
};

module.exports = {
  processErrorHandler,
};
