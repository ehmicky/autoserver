'use strict';

const { startPerf, emitPerfEvent } = require('../../perf');

// Record how the request handling takes
const perfEvent = async function (nextFunc, input) {
  // Used by other middleware, like timestamp, requestTimeout
  const now = Date.now();

  // Stopped by responseTime middleware. Reported by this middleware.
  const reqPerf = startPerf('all', 'all');

  const inputA = { ...input, reqPerf, now };
  const inputB = await nextFunc(inputA);

  // Total request time, stopped just before the response is sent
  // Do not report if exception was thrown
  const { reqInfo, response: { respPerf, measures }, runOpts } = inputB;
  const measuresA = [respPerf, ...measures];
  await emitPerfEvent({
    reqInfo,
    phase: 'request',
    measures: measuresA,
    runOpts,
  });

  return inputB;
};

module.exports = {
  perfEvent,
};
