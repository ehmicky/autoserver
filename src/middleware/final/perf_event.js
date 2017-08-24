'use strict';

const { emitPerfEvent } = require('../../perf');

const perfEvent = async function ({
  error,
  response: { respPerf, measures },
  runOpts,
  mInput,
}) {
   // Do not report if exception was thrown
  if (error) { return; }

  return;

  // Total request time, stopped just before the response is sent
  await emitPerfEvent({
    mInput,
    phase: 'request',
    measures: [respPerf, ...measures],
    runOpts,
  });
};

module.exports = {
  perfEvent,
};
