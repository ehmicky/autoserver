'use strict'

const { getAdapter } = require('../adapters/get.js')

const { protocolAdapters } = require('./wrap')

// Retrieves protocol adapter
const getProtocol = function(key) {
  return getAdapter({ adapters: protocolAdapters, key, name: 'protocol' })
}

module.exports = {
  getProtocol,
}
