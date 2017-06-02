'use strict';


const { onlyOnce } = require('../utilities');
const { Log } = require('../logging');
const { EngineError, getStandardError, getErrorMessage } = require('../error');


const processErrorHandler = function ({ opts }) {
  checkUniqueCall();

  const log = new Log({ opts, phase: 'process' });

  setupHandlers({ log });
};

// Since `startServer()` manipulates process, e.g. by intercepting signals
// or calling process.exit(), we consider it owns it, which implies:
//   - only once instance of this engine per process
//   - this engine cannot share a process with other significant modules/parts
const checkUniqueCall = function () {
  try {
    uniqueCall();
  } catch (innererror) {
    const message = '\'startServer()\' can only be called once per process.';
    throw new EngineError(message, { reason: 'PROCESS_ERROR', innererror });
  }
};
const uniqueCall = onlyOnce(() => {}, { error: true });

const setupHandlers = function ({ log }) {
  setupUnhandledRejection({ log });
  setupRejectionHandled({ log });
  setupWarning({ log });
};

const setupUnhandledRejection = function ({ log }) {
  process.on('unhandledRejection', value => {
    const message = 'A promise was rejected and not handled right away';
    processHandler({ log, value, message });
  });
};

const setupRejectionHandled = function ({ log }) {
  process.on('rejectionHandled', () => {
    const message = 'A promise was rejected but handled too late';
    processHandler({ log, message });
  });
};

const setupWarning = function ({ log }) {
  process.on('warning', value => {
    processHandler({ log, value });
  });
};

const processHandler = function ({ log, value, message }) {
  let innererror;
  if (value instanceof Error) {
    innererror = value;
  } else if (typeof value === 'string') {
    const message = typeof value === 'string' ? value : '';
    innererror = new EngineError(message, { reason: 'PROCESS_ERROR' });
  }

  const error = new EngineError(message, {
    reason: 'PROCESS_ERROR',
    innererror,
  });

  const standardError = getStandardError({ log, error });
  const errorMessage = getErrorMessage({ error: standardError });
  log.error(errorMessage, { type: 'failure', errorInfo: standardError });
};


module.exports = {
  processErrorHandler,
};
