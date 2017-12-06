'use strict';

const { report } = require('./report');

const handler = {
  name: 'custom',
  title: 'Custom log handler',
  description: 'Log handler using a custom function',
  report,
  reportPerf: report,
};

module.exports = handler;
