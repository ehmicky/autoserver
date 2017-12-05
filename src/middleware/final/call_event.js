'use strict';

const { logEvent } = require('../../log');

// Main "call" event middleware.
// Each request creates exactly one "call" event, whether successful or not
const callEvent = function ({
  schema,
  level,
  mInput,
  error,
  respPerf: { duration } = {},
}) {
  return logEvent({
    mInput,
    event: 'call',
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
