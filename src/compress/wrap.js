'use strict';

const { wrapAdapters } = require('../adapters');

const adapters = require('./adapters');
const { compress, decompress } = require('./transform');

const members = [
  'name',
  'title',
];

const methods = {
  compress,
  decompress,
};

const compressAdapters = wrapAdapters({
  adapters,
  members,
  methods,
  reason: 'COMPRESS',
});

module.exports = {
  compressAdapters,
};
