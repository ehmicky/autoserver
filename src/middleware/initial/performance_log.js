'use strict';

// Log how the request handling takes
const performanceLog = async function (nextFunc, input) {
  // Total request time, stopped just before the response is sent
  const { log } = input;
  log.perf.all = log.perf.start('all', 'all');

  // Used by other middleware, like timestamp and requestTimeout
  input.now = Date.now();

  const response = await nextFunc(input);

  // Do not report if exception was thrown
  await log.perf.report();

  return response;
};

module.exports = {
  performanceLog,
};
