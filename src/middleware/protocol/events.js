'use strict';

const { getReason, normalizeError, rethrowError } = require('../../error');
const {
  STATUS_LEVEL_MAP,
  bufferEventReport,
  addLogInfo,
} = require('../../events');

// Main request events middleware.
// Each request creates exactly one request event, whether successful or not,
// unless it crashed very early (i.e. before this middleware), in which case
// it will still be handled by the error events middleware.
const eventsRecorder = async function (nextFunc, input) {
  try {
    const response = await nextFunc(input);

    const responseA = getEventsReport({ input, response });

    return responseA;
  } catch (error) {
    const errorA = normalizeError({ error });

    const errorReason = getReason({ error: errorA });
    const errorB = addLogInfo(errorA, { errorReason });

    const errorC = getEventsReport({ input, error: errorB });

    rethrowError(errorC);
  }
};

// The events will build the message and the `requestInfo`
// We do not do it now, because we want the full protocol layer to end first,
// do `requestInfo` is full.
const getEventsReport = function ({ input: { runtimeOpts }, error, response }) {
  const level = getLevel({ error, response });

  const eventReport = { type: 'call', phase: 'request', level, runtimeOpts };

  return bufferEventReport(response || error, eventReport);
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
  eventsRecorder,
};
