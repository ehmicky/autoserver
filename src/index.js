'use strict';

const { startRequirePerf, stopRequirePerf } = require('./require_perf');

startRequirePerf();

const index = {
  ...require('./instructions').instructions,
  ...require('./cli'),
};

stopRequirePerf();

module.exports = index;
