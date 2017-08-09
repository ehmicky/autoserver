'use strict';

// Error handling for all failures that are process-related
// If a single process might start two instances of the server, each instance
// will collect the warnings of all the instances.
// Note that process events fired that do not belong to api-engine might be
// caught as well.
const processErrorHandler = function ({ processLog }) {
  setupUnhandledRejection({ processLog });
  setupRejectionHandled({ processLog });
  setupWarning({ processLog });
};

const setupUnhandledRejection = function ({ processLog }) {
  process.on('unhandledRejection', async error => {
    const message = `A promise was rejected and not handled right away\n${error}`;
    await processLog({ message });
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
