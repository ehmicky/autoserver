const { getAdapter } = require('../adapters/get.js')

const { compressAdapters } = require('./wrap')

// Retrieves compression adapter
const getAlgo = function(algo = 'identity') {
  const algoA = algo.trim().toLowerCase()

  const compressAdapter = getAdapter({
    adapters: compressAdapters,
    key: algoA,
    name: 'compression algorithm',
  })
  return compressAdapter
}

// Find compression algorithm is among the adapters.
// Follows key orders, i.e. priority set by this module.
const findAlgo = function(algos) {
  return Object.keys(compressAdapters).find(algo => algos.includes(algo))
}

const getAlgos = function() {
  return Object.keys(compressAdapters)
}

const DEFAULT_ALGO = getAlgo('identity')

module.exports = {
  getAlgo,
  findAlgo,
  getAlgos,
  DEFAULT_ALGO,
}
