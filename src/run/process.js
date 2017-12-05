'use strict';

const { logEvent } = require('../log');
const { normalizeError } = require('../error');

// Error handling for all failures that are process-related
// If a single process might start two instances of the server, each instance
// will collect the warnings of all the instances.
// Note that process events fired that do not belong to apiengine might be
// caught as well.
const processErrorHandler = function ({ schema }) {
  setupUnhandledRejection({ schema });
  setupRejectionHandled({ schema });
  setupWarning({ schema });
};

const setupUnhandledRejection = function ({ schema }) {
  process.on('unhandledRejection', async error => {
    const message = getMessage({ error });
    const messageA = `A promise was rejected and not handled right away\n${message}`;
    await emitProcessEvent({ message: messageA, schema });
  });
};

const getMessage = function ({ error }) {
  if (typeof error === 'string') { return error; }

  const nameA = ['details', 'stack', 'message', 'description']
    .find(name => error[name]);
  return error[nameA] || '';
};

const setupRejectionHandled = function ({ schema }) {
  process.on('rejectionHandled', async () => {
    const message = 'A promise was rejected but handled too late';
    await emitProcessEvent({ message, schema });
  });
};

const setupWarning = function ({ schema }) {
  process.on('warning', async error => {
    await emitProcessEvent({ error, schema });
  });
};

// Report process problems as events with event 'failure'
const emitProcessEvent = async function ({ error, message, schema }) {
  const errorA = normalizeError({ error, message, reason: 'PROCESS_ERROR' });

  await logEvent({
    event: 'failure',
    phase: 'process',
    vars: { error: errorA },
    schema,
  });
};

module.exports = {
  processErrorHandler,
};
