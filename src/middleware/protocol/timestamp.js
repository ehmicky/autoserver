'use strict';

const { startPerf } = require('../../perf');

// Start the main performance counter, and add request timestamp
const addTimestamp = function () {
  // Used by other middleware
  const timestamp = (new Date()).toISOString();

  // Calculate how long the whole request takes
  const reqPerf = startPerf('request', 'middleware');

  return { timestamp, reqPerf };
};

module.exports = {
  addTimestamp,
};
