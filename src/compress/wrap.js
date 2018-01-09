'use strict';

const { wrapAdapters } = require('../utilities');

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

const compressAdapters = wrapAdapters({ adapters, members, methods });

module.exports = {
  compressAdapters,
};
