import { getAdapter } from '../adapters/get.js'

import { rpcAdapters } from './wrap.js'

// Retrieves rpc adapter
const getRpc = function(key) {
  return getAdapter({ adapters: rpcAdapters, key, name: 'RPC' })
}

module.exports = {
  getRpc,
}
