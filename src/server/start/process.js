'use strict';

const { reportLog } = require('../../logging');
const { getStandardError, normalizeError } = require('../../error');

// Error handling for all failures that are process-related
// If a single process might start two instances of the server, each instance
// will collect the warnings of all the instances.
// Note that process events fired that do not belong to api-engine might be
// caught as well.
const processErrorHandler = function ({ runtimeOpts }) {
  setupUnhandledRejection({ processLog, runtimeOpts });
  setupRejectionHandled({ processLog, runtimeOpts });
  setupWarning({ processLog, runtimeOpts });
};

const setupUnhandledRejection = function ({ runtimeOpts }) {
  process.on('unhandledRejection', async error => {
    const message = getMessage({ error });
    const messageA = `A promise was rejected and not handled right away\n${message}`;
    await processLog({ message: messageA, runtimeOpts });
  });
};

const getMessage = function ({ error }) {
  if (typeof error === 'string') { return error; }

  const nameA = ['message', 'description', 'details', 'stack']
    .find(name => error[name]);
  return error[nameA] || '';
};

const setupRejectionHandled = function ({ runtimeOpts }) {
  process.on('rejectionHandled', async () => {
    const message = 'A promise was rejected but handled too late';
    await processLog({ message, runtimeOpts });
  });
};

const setupWarning = function ({ runtimeOpts }) {
  process.on('warning', async error => {
    await processLog({ error, runtimeOpts });
  });
};

// Report process problems as logs with type 'failure'
const processLog = async function ({ error, message, runtimeOpts }) {
  const errorA = normalizeError({ error, message, reason: 'PROCESS_ERROR' });
  const errorB = getStandardError({ error: errorA });

  const info = { errorInfo: errorB };
  await reportLog({ type: 'failure', phase: 'process', info, runtimeOpts });
};

module.exports = {
  processErrorHandler,
};
