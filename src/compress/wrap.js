'use strict';

const { wrapAdapters } = require('../adapters');

const adapters = require('./adapters');

const members = [
  'name',
  'title',
  'decompress',
  'compress',
];

const compressAdapters = wrapAdapters({
  adapters,
  members,
  reason: 'COMPRESS',
});

module.exports = {
  compressAdapters,
};
