'use strict';

const { onlyOnce, identity } = require('../../utilities');
const { throwError } = require('../../error');

// Error handling for all failures that are process-related
const processErrorHandler = function ({ processLog }) {
  checkUniqueCall();

  setupUnhandledRejection({ processLog });
  setupRejectionHandled({ processLog });
  setupWarning({ processLog });
};

// Since `startServer()` manipulates process, e.g. by intercepting signals,
// we consider it owns it, which implies:
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

module.exports = {
  processErrorHandler,
};
