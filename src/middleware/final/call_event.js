'use strict';

const { getReason, rethrowError, normalizeError } = require('../../error');
const { emitEvent, addReqInfo, STATUS_LEVEL_MAP } = require('../../events');

// Main "call" event middleware.
// Each request creates exactly one "call" event, whether successful or not
const callEvent = async function (input) {
  try {
    await emitReqEvent({ input });

    return input;
  } catch (error) {
    const errorA = normalizeError({ error });

    await emitReqEvent({ input, error: errorA });

    rethrowError(errorA);
  }
};

const emitReqEvent = async function ({ input, input: { runOpts }, error }) {
  const level = getLevel({ input, error });
  const reqInfo = getReqInfo({ input, error });

  await emitEvent({
    reqInfo,
    type: 'call',
    phase: 'request',
    level,
    runOpts,
  });
};

const getLevel = function ({ input: { response = {} }, error = {} }) {
  const status = error.status || response.status || 'SERVER_ERROR';
  return STATUS_LEVEL_MAP[status] || 'error';
};

const getReqInfo = function ({ input, input: { reqInfo }, error }) {
  if (!error) { return reqInfo; }

  const errorReason = getReason({ error });
  const { reqInfo: reqInfoA } = addReqInfo(input, { errorReason });
  return reqInfoA;
};

module.exports = {
  callEvent,
};
