'use strict';

const { report } = require('./report');

const handler = {
  name: 'http',
  title: 'HTTP log handler',
  description: 'Log handler using a HTTP request',
  report,
  reportPerf: report,
};

module.exports = handler;
