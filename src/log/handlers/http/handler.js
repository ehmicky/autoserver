'use strict';

const { report } = require('./report');

const handler = {
  name: 'http',
  title: 'HTTP logger',
  description: 'Logger using a HTTP request',
  report,
  reportPerf: report,
};

module.exports = handler;
