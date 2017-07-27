'use strict';

const { startPerf } = require('../../perf');
const { reportPerf } = require('../../logging');

// Log how the request handling takes
const performanceLog = async function (nextFunc, input) {
  const { log } = input;

  // Used by other middleware, like timestamp, requestTimeout
  const now = Date.now();

  // Stopped by responseTime middleware. Reported by this middleware.
  const reqPerf = startPerf('all', 'all');

  const nextInput = Object.assign({}, input, { reqPerf, now });
  const response = await nextFunc(nextInput);

  // Total request time, stopped just before the response is sent
  // Do not report if exception was thrown
  const measures = [response.respPerf, ...response.measures];
  await reportPerf({ log, measures });

  return response;
};

module.exports = {
  performanceLog,
};
