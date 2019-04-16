const { getNames } = require('../adapters/get.js')

const { RPC_ADAPTERS } = require('./adapters/main.js')

const RPCS = getNames(RPC_ADAPTERS)

module.exports = {
  RPCS,
}
