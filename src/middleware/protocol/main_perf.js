'use strict';

const { startPerf } = require('../../perf');

// Start the main performance counter
const startMainPerf = function () {
  // Used by other middleware
  const timestamp = (new Date()).toISOString();

  // Stopped by responseTime middleware. Reported by this middleware.
  const reqPerf = startPerf('all', 'all');

  return { reqPerf, timestamp };
};

module.exports = {
  startMainPerf,
};
