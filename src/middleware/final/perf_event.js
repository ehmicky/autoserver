'use strict';

const { emitPerfEvent } = require('../../perf');

// Event performance events related to the current request,
// e.g. how long each middleware lasted.
const perfEvent = async function (
  { error, runOpts, mInput },
  nextLayer,
  { measures },
) {
  // Do not report if an exception was thrown
  if (error) { return; }

  // Total request time, stopped just before the response is sent
  await emitPerfEvent({ mInput, phase: 'request', measures, runOpts });
};

module.exports = {
  perfEvent,
};
