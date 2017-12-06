'use strict';

const { report } = require('./report');

const handler = {
  name: 'console',
  title: 'Console logger',
  description: 'Logger printing on the console, meant as a development helper',
  report,
  // Do not report `perf` events as it would be too verbose
};

module.exports = handler;
