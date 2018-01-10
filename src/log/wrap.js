'use strict';

const { wrapAdapters } = require('../adapters');

const adapters = require('./adapters');

const members = [
  'name',
  'title',
  'report',
  'reportPerf',
  'getOpts',
];

const logAdapters = wrapAdapters({
  adapters,
  members,
  reason: 'LOG',
});

module.exports = {
  logAdapters,
};
