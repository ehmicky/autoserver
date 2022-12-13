import { getAdapter } from '../adapters/get.js'

import { protocolAdapters } from './wrap.js'

// Retrieves protocol adapter
export const getProtocol = (key) =>
  getAdapter({ adapters: protocolAdapters, key, name: 'protocol' })
