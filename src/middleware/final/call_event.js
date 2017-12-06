'use strict';

const { logEvent } = require('../../log');
const { nanoSecsToMilliSecs } = require('../../perf');

// Main "call" event middleware.
// Each request creates exactly one "call" event, whether successful or not
const callEvent = function ({
  schema,
  level,
  mInput,
  error,
  respPerf: { duration } = {},
}) {
  const durationA = nanoSecsToMilliSecs({ duration });

  return logEvent({
    mInput,
    event: 'call',
    phase: 'request',
    level,
    vars: { error, duration: durationA },
    schema,
  });
};

module.exports = {
  callEvent,
};
