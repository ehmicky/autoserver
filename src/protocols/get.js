'use strict';

const { getAdapter } = require('../adapters');

const { protocolAdapters } = require('./wrap');

// Retrieves protocol adapter
const getProtocol = function (key) {
  return getAdapter({ adapters: protocolAdapters, key, name: 'protocol' });
};

module.exports = {
  getProtocol,
};
