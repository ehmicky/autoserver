'use strict';

const { startPerf } = require('../../perf');

// Start the main performance counter
const startMainPerf = function () {
  // Used by other middleware, like timestamp, requestTimeout
  const now = Date.now();

  const timestamp = (new Date(now)).toISOString();

  // Stopped by responseTime middleware. Reported by this middleware.
  const reqPerf = startPerf('all', 'all');

  return { reqPerf, now, timestamp };
};

module.exports = {
  startMainPerf,
};
