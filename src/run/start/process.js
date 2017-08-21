'use strict';

const { emitEvent } = require('../../events');
const { getStandardError, normalizeError } = require('../../error');

// Error handling for all failures that are process-related
// If a single process might start two instances of the server, each instance
// will collect the warnings of all the instances.
// Note that process events fired that do not belong to api-engine might be
// caught as well.
const processErrorHandler = function ({ runtimeOpts }) {
  setupUnhandledRejection({ runtimeOpts });
  setupRejectionHandled({ runtimeOpts });
  setupWarning({ runtimeOpts });
};

const setupUnhandledRejection = function ({ runtimeOpts }) {
  process.on('unhandledRejection', async error => {
    const message = getMessage({ error });
    const messageA = `A promise was rejected and not handled right away\n${message}`;
    await emitProcessEvent({ message: messageA, runtimeOpts });
  });
};

const getMessage = function ({ error }) {
  if (typeof error === 'string') { return error; }

  const nameA = ['details', 'stack', 'message', 'description']
    .find(name => error[name]);
  return error[nameA] || '';
};

const setupRejectionHandled = function ({ runtimeOpts }) {
  process.on('rejectionHandled', async () => {
    const message = 'A promise was rejected but handled too late';
    await emitProcessEvent({ message, runtimeOpts });
  });
};

const setupWarning = function ({ runtimeOpts }) {
  process.on('warning', async error => {
    await emitProcessEvent({ error, runtimeOpts });
  });
};

// Report process problems as events with type 'failure'
const emitProcessEvent = async function ({ error, message, runtimeOpts }) {
  const errorA = normalizeError({ error, message, reason: 'PROCESS_ERROR' });
  const errorB = getStandardError({ error: errorA });

  await emitEvent({
    type: 'failure',
    phase: 'process',
    errorInfo: errorB,
    runtimeOpts,
  });
};

module.exports = {
  processErrorHandler,
};
