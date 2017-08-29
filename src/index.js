'use strict';

const { startRequirePerf } = require('./require_perf');

startRequirePerf();

module.exports = {
  ...require('./instructions'),
  ...require('./cli'),
};
