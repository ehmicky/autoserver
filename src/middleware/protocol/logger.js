'use strict';

const { getReason, normalizeError, rethrowError } = require('../../error');
const { STATUS_LEVEL_MAP, bufferLogReport } = require('../../logging');

// Main request logging middleware.
// Each request creates exactly one log, whether successful or not,
// unless it crashed very early (i.e. before this middleware), in which case
// it will still be handled by the error logging middleware.
const logger = async function logger (nextFunc, input) {
  const { log } = input;

  try {
    const response = await nextFunc(input);

    const newResponse = getLogReport({ response });

    return newResponse;
  } catch (error) {
    const errorObj = normalizeError({ error });

    const errorReason = getReason({ error });
    log.add({ errorReason });

    const newError = getLogReport({ error: errorObj });

    rethrowError(newError);
  }
};

// The logger will build the message and the `requestInfo`
// We do not do it now, because we want the full protocol layer to end first,
// do `requestInfo` is full.
const getLogReport = function ({ error, response }) {
  const level = getLevel({ error, response });

  const logReport = { level, message: '', opts: { type: 'call' } };

  return bufferLogReport(response || error, logReport);
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

module.exports = {
  logger,
};
