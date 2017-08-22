'use strict';

const { getReason } = require('../../error');
const { emitEvent, addReqInfo, STATUS_LEVEL_MAP } = require('../../events');

// Main "call" event middleware.
// Each request creates exactly one "call" event, whether successful or not
const callEvent = async function (input) {
  await emitReqEvent({ input });

  return input;
};

const emitReqEvent = async function ({ input, input: { runOpts } }) {
  const level = getLevel({ input });
  const reqInfo = getReqInfo({ input });

  await emitEvent({
    reqInfo,
    type: 'call',
    phase: 'request',
    level,
    runOpts,
  });
};

const getLevel = function ({
  input: { status: normalStatus, error: { status: errorStatus } = {} },
}) {
  const status = errorStatus || normalStatus || 'SERVER_ERROR';
  return STATUS_LEVEL_MAP[status] || 'error';
};

const getReqInfo = function ({ input, input: { reqInfo, error } }) {
  if (!error) { return reqInfo; }

  const errorReason = getReason({ error });
  const { reqInfo: reqInfoA } = addReqInfo(input, { errorReason });
  return reqInfoA;
};

module.exports = {
  callEvent,
};
