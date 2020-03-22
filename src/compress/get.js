import { getAdapter } from '../adapters/get.js'

import { compressAdapters } from './wrap.js'

// Retrieves compression adapter
export const getAlgo = function (algo = 'identity') {
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
export const findAlgo = function (algos) {
  return Object.keys(compressAdapters).find((algo) => algos.includes(algo))
}

export const getAlgos = function () {
  return Object.keys(compressAdapters)
}

export const DEFAULT_ALGO = getAlgo('identity')
