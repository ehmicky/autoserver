'use strict';

const { getReason, normalizeError, rethrowError } = require('../../error');
const {
  STATUS_LEVEL_MAP,
  bufferLogReport,
  addLogInfo,
} = require('../../logging');

// Main request logging middleware.
// Each request creates exactly one log, whether successful or not,
// unless it crashed very early (i.e. before this middleware), in which case
// it will still be handled by the error logging middleware.
const logger = async function logger (nextFunc, input) {
  try {
    const response = await nextFunc(input);

    const responseA = getLogReport({ input, response });

    return responseA;
  } catch (error) {
    const errorA = normalizeError({ error });

    const errorReason = getReason({ error: errorA });
    const errorB = addLogInfo(errorA, { errorReason });

    const errorC = getLogReport({ input, error: errorB });

    rethrowError(errorC);
  }
};

// The logger will build the message and the `requestInfo`
// We do not do it now, because we want the full protocol layer to end first,
// do `requestInfo` is full.
const getLogReport = function ({ input: { runtimeOpts }, error, response }) {
  const level = getLevel({ error, response });

  const logReport = { type: 'call', phase: 'request', level, runtimeOpts };

  return bufferLogReport(response || error, logReport);
};

const getLevel = function ({ error, response }) {
  const status = getStatus({ error, response });
  const level = STATUS_LEVEL_MAP[status] || 'error';
  return level;
};

const getStatus = function ({ error, response }) {
  const obj = error || response;
  return obj.status || 'SERVER_ERROR';
};

module.exports = {
  logger,
};
