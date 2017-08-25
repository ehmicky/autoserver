'use strict';

const { emitEvent, STATUS_LEVEL_MAP } = require('../../events');

// Main "call" event middleware.
// Each request creates exactly one "call" event, whether successful or not
const callEvent = async function ({
  runOpts,
  status,
  error,
  mInput,
  respPerf: { duration },
}) {
  const level = getLevel({ status, error });

  await emitEvent({
    mInput,
    type: 'call',
    phase: 'request',
    level,
    runOpts,
    duration,
  });
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
