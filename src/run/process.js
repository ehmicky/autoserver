'use strict';

const process = require('process');

const { logEvent } = require('../log');
const { normalizeError } = require('../errors');

// Error handling for all failures that are process-related
// If a single process might start two instances of the server, each instance
// will collect the warnings of all the instances.
// Note that process events fired that do not belong to apiengine might be
// caught as well.
const processErrorHandler = function ({ config }) {
  setupUnhandledRejection({ config });
  setupRejectionHandled({ config });
  setupWarning({ config });
};

const setupUnhandledRejection = function ({ config }) {
  process.on('unhandledRejection', async error => {
    const message = getMessage({ error });
    const messageA = `A promise was rejected and not handled right away\n${message}`;
    await emitProcessEvent({ message: messageA, config });
  });
};

const getMessage = function ({ error }) {
  if (typeof error === 'string') { return error; }

  const nameA = ['details', 'stack', 'message', 'description']
    .find(name => error[name]);
  return error[nameA] || '';
};

const setupRejectionHandled = function ({ config }) {
  process.on('rejectionHandled', async () => {
    const message = 'A promise was rejected but handled too late';
    await emitProcessEvent({ message, config });
  });
};

const setupWarning = function ({ config }) {
  process.on('warning', async error => {
    await emitProcessEvent({ error, config });
  });
};

// Report process problems as events with event 'failure'
const emitProcessEvent = async function ({ error, message, config }) {
  const errorA = normalizeError({ error, message, reason: 'ENGINE' });

  await logEvent({
    event: 'failure',
    phase: 'process',
    params: { error: errorA },
    config,
  });
};

module.exports = {
  processErrorHandler,
};
