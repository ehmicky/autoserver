'use strict';

const { emitEvent } = require('../../events');

// Main "call" event middleware.
// Each request creates exactly one "call" event, whether successful or not
const callEvent = async function ({
  runOpts,
  schema,
  level,
  mInput,
  error,
  respPerf: { duration } = {},
}) {
  await emitEvent({
    mInput,
    error,
    type: 'call',
    phase: 'request',
    level,
    runOpts,
    schema,
    duration,
  });
};

module.exports = {
  callEvent,
};
