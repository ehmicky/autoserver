'use strict';

const { startPerf, stopPerf } = require('../perf');
const { logPerfEvent } = require('../log');

// Monitor startup time
const startStartupPerf = function () {
  const startupPerf = startPerf('startup');
  return { startupPerf };
};

const stopStartupPerf = function ({ startupPerf, measures }) {
  const startupPerfA = stopPerf(startupPerf);
  const measuresA = [startupPerfA, ...measures];
  return { measures: measuresA };
};

// Emit "perf" event with startup performance
const reportStartupPerf = function ({ config, measures }) {
  return logPerfEvent({ phase: 'startup', config, measures });
};

module.exports = {
  startStartupPerf,
  stopStartupPerf,
  reportStartupPerf,
};
