'use strict';

const { startPerf } = require('../../perf');

// Start the main performance counter
const startMainPerf = function (input) {
  // Used by other middleware, like timestamp, requestTimeout
  const now = Date.now();

  // Stopped by responseTime middleware. Reported by this middleware.
  const reqPerf = startPerf('all', 'all');

  const inputA = { ...input, reqPerf, now };
  return inputA;
};

module.exports = {
  startMainPerf,
};
