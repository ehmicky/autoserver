'use strict';

const { getReason } = require('../../error');
const { emitEvent, addReqInfo, STATUS_LEVEL_MAP } = require('../../events');

// Main "call" event middleware.
// Each request creates exactly one "call" event, whether successful or not
const callEvent = async function (input) {
  const inputA = addErrorReason({ input });

  await emitReqEvent({ input: inputA });

  return inputA;
};

const addErrorReason = function ({ input, input: { error } }) {
  if (!error) { return input; }

  const errorReason = getReason({ error });
  const inputA = addReqInfo(input, { errorReason });
  return inputA;
};

const emitReqEvent = async function ({ input, input: { reqInfo, runOpts } }) {
  const level = getLevel({ input });

  await emitEvent({ reqInfo, type: 'call', phase: 'request', level, runOpts });
};

const getLevel = function ({
  input: { status: normalStatus, error: { status: errorStatus } = {} },
}) {
  const status = errorStatus || normalStatus || 'SERVER_ERROR';
  return STATUS_LEVEL_MAP[status] || 'error';
};

module.exports = {
  callEvent,
};
