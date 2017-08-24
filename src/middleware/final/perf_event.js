'use strict';

const { emitPerfEvent } = require('../../perf');

// Event performance events related to the current request,
// e.g. how long each middleware lasted.
const perfEvent = async function (
  { error, runOpts, mInput, respPerf },
  nextLayer,
  { measures },
) {
  // Do not report if an exception was thrown
  if (error) { return; }

  const measuresA = [...measures, respPerf];
  await emitPerfEvent({
    mInput,
    phase: 'request',
    measures: measuresA,
    runOpts,
  });
};

module.exports = {
  perfEvent,
};
