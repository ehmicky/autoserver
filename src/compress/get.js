import { getAdapter } from '../adapters/get.js'

import { compressAdapters } from './wrap.js'

// Retrieves compression adapter
export const getAlgo = (algo = 'identity') => {
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
export const findAlgo = (algos) =>
  Object.keys(compressAdapters).find((algo) => algos.includes(algo))

export const getAlgos = () => Object.keys(compressAdapters)

export const DEFAULT_ALGO = getAlgo('identity')
