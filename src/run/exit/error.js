'use strict';

const { addErrorHandler, normalizeError } = require('../../error');
const { logEvent } = require('../../log');

// Shutdown failures events
const addExitHandler = function (func) {
  return addErrorHandler(func, funcHandler);
};

const funcHandler = async function (
  error,
  { config, type, adapter: { title, name } },
) {
  const message = FAILURE_MESSAGES[type];
  const messageA = `${title} - ${message}`;

  const reason = REASONS[type];
  const errorA = normalizeError({ error, reason });

  await logEvent({
    event: 'failure',
    phase: 'shutdown',
    message: messageA,
    params: { error: errorA },
    config,
  });

  // Exit status
  return { [name]: false };
};

const FAILURE_MESSAGES = {
  protocols: 'Failed shutdown',
  databases: 'Failed disconnection',
};

const REASONS = {
  protocols: 'PROTOCOL_ERROR',
  databases: 'DB_ERROR',
};

module.exports = {
  addExitHandler,
};
