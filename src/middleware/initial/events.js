'use strict';

const { getReason, rethrowError, normalizeError } = require('../../error');
const { emitEvent, addLogInfo, STATUS_LEVEL_MAP } = require('../../events');

// Main "call" events middleware.
// Each request creates exactly one "call" event, whether successful or not
const callEvents = async function (nextFunc, input) {
  try {
    const response = await nextFunc(input);

    const responseA = await emitReqEvent({ input, obj: response });

    return responseA;
  } catch (error) {
    const errorA = getReqError({ error });
    const errorB = await emitReqEvent({ input, obj: errorA });

    rethrowError(errorB);
  }
};

const getReqError = function ({ error }) {
  const errorA = normalizeError({ error });

  const errorReason = getReason({ error: errorA });
  const errorB = addLogInfo(errorA, { errorReason });

  return errorB;
};

const emitReqEvent = async function ({
  input: { runtimeOpts },
  obj,
  obj: { log },
}) {
  const level = getLevel({ obj });

  await emitEvent({ log, type: 'call', phase: 'request', level, runtimeOpts });

  return obj;
};

const getLevel = function ({ obj: { status = 'SERVER_ERROR' } }) {
  return STATUS_LEVEL_MAP[status] || 'error';
};

module.exports = {
  callEvents,
};
