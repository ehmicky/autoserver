'use strict';

const compressible = require('compressible');

const { getNames } = require('../adapters');

const compressAdapters = require('./adapters');

const ALGOS = getNames(compressAdapters);

// Do not try to compress binary content types
const shouldCompress = function ({ contentType }) {
  return compressible(contentType);
};

module.exports = {
  ALGOS,
  shouldCompress,
};
