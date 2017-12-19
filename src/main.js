'use strict';

const { startRequirePerf, stopRequirePerf } = require('./require_perf');

startRequirePerf();

module.exports = {
  ...require('./instructions'),
  ...require('./cli'),
};

stopRequirePerf();
