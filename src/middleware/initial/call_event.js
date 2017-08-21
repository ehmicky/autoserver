'use strict';

const { getReason, rethrowError, normalizeError } = require('../../error');
const { emitEvent, addReqInfo, STATUS_LEVEL_MAP } = require('../../events');

// Main "call" event middleware.
// Each request creates exactly one "call" event, whether successful or not
const callEvent = async function (nextFunc, input) {
  try {
    const inputA = await nextFunc(input);

    await emitReqEvent({ input, obj: inputA.response });

    return inputA;
  } catch (error) {
    const errorA = normalizeError({ error });

    const errorReason = getReason({ error: errorA });
    const inputA = addReqInfo(input, { errorReason });

    await emitReqEvent({ input: inputA, obj: errorA });

    rethrowError(errorA);
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
  callEvent,
};
