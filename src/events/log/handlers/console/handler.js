'use strict';

const { report } = require('./report');
const { reportPerf } = require('./report_perf');

const handler = {
  name: 'console',
  title: 'Console logger',
  description: 'Logger printing on the console, meant for debugging',
  report,
  reportPerf,
};

module.exports = handler;
