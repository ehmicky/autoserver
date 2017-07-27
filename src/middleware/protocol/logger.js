'use strict';

const { getReason, normalizeError, rethrowError } = require('../../error');
const { STATUS_LEVEL_MAP } = require('../../logging');

// Main request logging middleware.
// Each request creates exactly one log, whether successful or not,
// unless it crashed very early (i.e. before this middleware), in which case
// it will still be handled by the error logging middleware.
const logger = async function logger (nextFunc, input) {
  try {
    const response = await nextFunc(input);

    await handleLog({ response, input });

    return response;
  } catch (error) {
    const errorObj = normalizeError({ error });

    addErrorReason({ error: errorObj, input });
    await handleLog({ error: errorObj, input });

    rethrowError(errorObj);
  }
};

const handleLog = async function ({ error, response, input: { log } }) {
  const level = getLevel({ error, response });

  // The logger will build the message and the `requestInfo`
  // We do not do it now, because we want the full protocol layer to end first,
  // do `requestInfo` is full.
  await log[level]('', { type: 'call' });
};

const getLevel = function ({ error, response }) {
  const status = getStatus({ error, response });

  // If status is already set, reuse it
  // If an error was thrown, level should always be 'warn' or 'error'
  const errorLevel = status === 'CLIENT_ERROR' ? 'warn' : 'error';
  const defaultLevel = STATUS_LEVEL_MAP[status] || 'error';
  const level = error ? errorLevel : defaultLevel;
  return level;
};

const getStatus = function ({ error, response }) {
  return (error && error.status) ||
    (response && response.status) ||
    'SERVER_ERROR';
};

// Add information for `requestInfo.error`
const addErrorReason = function ({ error, input: { log } }) {
  const errorReason = getReason({ error });
  log.add({ errorReason });
};

module.exports = {
  logger,
};
