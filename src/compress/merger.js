'use strict';

const { keyBy } = require('../utilities');

const adapters = require('./adapters');

const compressAdapters = keyBy(adapters);

module.exports = {
  compressAdapters,
};
