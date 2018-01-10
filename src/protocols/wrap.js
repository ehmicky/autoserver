'use strict';

const { wrapAdapters } = require('../adapters');

const adapters = require('./adapters');
const { start } = require('./start');

const members = [
  'name',
  'title',
];

const methods = {
  startServer: start,
};

const protocolAdapters = wrapAdapters({
  adapters,
  members,
  methods,
  reason: 'PROTOCOL',
});

module.exports = {
  protocolAdapters,
};
