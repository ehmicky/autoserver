'use strict';

const { report } = require('./report');
const opts = require('./opts');
const { getOpts } = require('./get_opts');

const handler = {
  name: 'http',
  title: 'HTTP log handler',
  description: 'Log handler using a HTTP request',
  report,
  reportPerf: report,
  opts,
  getOpts,
};

module.exports = handler;
