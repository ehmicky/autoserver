'use strict';

const { report } = require('./report');

const handler = {
  name: 'custom',
  title: 'Custom logger',
  description: 'Logger using a custom function',
  report,
};

module.exports = handler;
