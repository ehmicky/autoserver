'use strict';

const { emitEvent, STATUS_LEVEL_MAP } = require('../../events');

// Main "call" event middleware.
// Each request creates exactly one "call" event, whether successful or not
const callEvent = async function (input) {
  const { runOpts, status, error } = input;

  const level = getLevel({ status, error });

  await emitEvent({ input, type: 'call', phase: 'request', level, runOpts });
};

const getLevel = function ({
  status: normalStatus,
  error: { status: errorStatus } = {},
}) {
  const status = errorStatus || normalStatus || 'SERVER_ERROR';
  return STATUS_LEVEL_MAP[status] || 'error';
};

module.exports = {
  callEvent,
};
