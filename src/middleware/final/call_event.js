'use strict';

const { emitEvent } = require('../../events');

// Main "call" event middleware.
// Each request creates exactly one "call" event, whether successful or not
const callEvent = async function ({
  runOpts,
  level,
  mInput,
  respPerf: { duration } = {},
}) {
  await emitEvent({
    mInput,
    type: 'call',
    phase: 'request',
    level,
    runOpts,
    duration,
  });
};

module.exports = {
  callEvent,
};
