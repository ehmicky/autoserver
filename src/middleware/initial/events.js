'use strict';

const { getReason, rethrowError, normalizeError } = require('../../error');
const { emitEvent, addReqInfo, STATUS_LEVEL_MAP } = require('../../events');

// Main "call" events middleware.
// Each request creates exactly one "call" event, whether successful or not
const callEvents = async function (nextFunc, input) {
  try {
    const response = await nextFunc(input);

    const responseA = await emitReqEvent({ input, obj: response });

    return responseA;
  } catch (error) {
    const errorA = normalizeError({ error });

    const errorReason = getReason({ error: errorA });
    const inputA = addReqInfo(input, { errorReason });

    const errorB = await emitReqEvent({ input: inputA, obj: errorA });

    rethrowError(errorB);
  }
};

const emitReqEvent = async function ({ input: { runOpts, reqInfo }, obj }) {
  const level = getLevel({ obj });

  await emitEvent({
    reqInfo,
    type: 'call',
    phase: 'request',
    level,
    runOpts,
  });

  return obj;
};

const getLevel = function ({ obj: { status = 'SERVER_ERROR' } }) {
  return STATUS_LEVEL_MAP[status] || 'error';
};

module.exports = {
  callEvents,
};
