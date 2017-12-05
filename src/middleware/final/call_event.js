'use strict';

const { emitEvent } = require('../../events');

// Main "call" event middleware.
// Each request creates exactly one "call" event, whether successful or not
const callEvent = function ({
  schema,
  level,
  mInput,
  error,
  respPerf: { duration } = {},
}) {
  return emitEvent({
    mInput,
    type: 'call',
    phase: 'request',
    level,
    vars: { error },
    schema,
    duration,
  });
};

module.exports = {
  callEvent,
};
