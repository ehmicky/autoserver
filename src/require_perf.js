'use strict';

const { hrtime } = process;

// Monitors how long it takes to require() the library
// As such, it should be triggered at the very beginning of the loading process
// and not require any dependency itself.
const startRequirePerf = function () {
  // eslint-disable-next-line fp/no-mutation
  requirePerf.pending = hrtime();
};

const stopRequirePerf = function () {
  const { stopPerf } = require('./perf');
  // eslint-disable-next-line fp/no-mutation
  stoppedRequirePerf = stopPerf(requirePerf);
};

const getRequirePerf = function () {
  return stoppedRequirePerf;
};

const requirePerf = { label: 'parsing', category: 'default' };
// eslint-disable-next-line fp/no-let, init-declarations
let stoppedRequirePerf;

module.exports = {
  startRequirePerf,
  stopRequirePerf,
  getRequirePerf,
};
