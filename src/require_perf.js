'use strict';

const { hrtime } = process;

// Monitors how long it takes to require() the library
// As such, it should be triggered at the very beginning of the loading process
// and not require any dependency itself.
const startRequirePerf = function () {
  // eslint-disable-next-line fp/no-mutation
  requirePerf.pending = hrtime();
};

const getRequirePerf = function () {
  return requirePerf;
};

const requirePerf = { label: 'parsing', category: 'default' };

module.exports = {
  startRequirePerf,
  getRequirePerf,
};
