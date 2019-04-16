import { getAdapter } from '../adapters/get.js'

import { logAdapters } from './wrap.js'

// Retrieves log adapter
const getLog = function(key) {
  return getAdapter({ adapters: logAdapters, key, name: 'log provider' })
}

module.exports = {
  getLog,
}
