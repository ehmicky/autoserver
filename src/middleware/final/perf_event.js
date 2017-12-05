'use strict';

const { emitPerfEvent } = require('../../perf');

// Event performance events related to the current request,
// e.g. how long each middleware lasted.
const perfEvent = function (
  { error, schema, mInput, respPerf },
  nextLayer,
  { measures },
) {
  // Do not report if an exception was thrown
  if (error) { return; }

  const measuresA = [...measures, respPerf];
  return emitPerfEvent({
    mInput,
    phase: 'request',
    measures: measuresA,
    schema,
  });
};

module.exports = {
  perfEvent,
};
