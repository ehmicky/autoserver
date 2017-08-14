'use strict';

const { startPerf, emitPerfEvent } = require('../../perf');

// Record how the request handling takes
const performanceEvent = async function (nextFunc, input) {
  // Used by other middleware, like timestamp, requestTimeout
  const now = Date.now();

  // Stopped by responseTime middleware. Reported by this middleware.
  const reqPerf = startPerf('all', 'all');

  const inputA = { ...input, reqPerf, now };
  const response = await nextFunc(inputA);

  // Total request time, stopped just before the response is sent
  // Do not report if exception was thrown
  const { log } = input;
  const measures = [response.respPerf, ...response.measures];
  const { runtimeOpts } = input;
  await emitPerfEvent({ log, phase: 'request', measures, runtimeOpts });

  return response;
};

module.exports = {
  performanceEvent,
};
