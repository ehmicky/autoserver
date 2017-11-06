'use strict';

const { emitEvent } = require('../events');
const { normalizeError } = require('../error');

// Error handling for all failures that are process-related
// If a single process might start two instances of the server, each instance
// will collect the warnings of all the instances.
// Note that process events fired that do not belong to apiengine might be
// caught as well.
const processErrorHandler = function ({ runOpts }) {
  setupUnhandledRejection({ runOpts });
  setupRejectionHandled({ runOpts });
  setupWarning({ runOpts });
};

const setupUnhandledRejection = function ({ runOpts }) {
  process.on('unhandledRejection', async error => {
    const message = getMessage({ error });
    const messageA = `A promise was rejected and not handled right away\n${message}`;
    await emitProcessEvent({ message: messageA, runOpts });
  });
};

const getMessage = function ({ error }) {
  if (typeof error === 'string') { return error; }

  const nameA = ['details', 'stack', 'message', 'description']
    .find(name => error[name]);
  return error[nameA] || '';
};

const setupRejectionHandled = function ({ runOpts }) {
  process.on('rejectionHandled', async () => {
    const message = 'A promise was rejected but handled too late';
    await emitProcessEvent({ message, runOpts });
  });
};

const setupWarning = function ({ runOpts }) {
  process.on('warning', async error => {
    await emitProcessEvent({ error, runOpts });
  });
};

// Report process problems as events with type 'failure'
const emitProcessEvent = async function ({ error, message, runOpts }) {
  const errorA = normalizeError({ error, message, reason: 'PROCESS_ERROR' });

  await emitEvent({
    type: 'failure',
    phase: 'process',
    errorInfo: errorA,
    runOpts,
  });
};

module.exports = {
  processErrorHandler,
};
