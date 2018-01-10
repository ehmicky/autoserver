'use strict';

const { getNames } = require('../adapters');

const rpcAdapters = require('./adapters');

const RPCS = getNames(rpcAdapters);

module.exports = {
  RPCS,
};
