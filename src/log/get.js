import { getAdapter } from '../adapters/get.js'

import { logAdapters } from './wrap.js'

// Retrieves log adapter
export const getLog = (key) =>
  getAdapter({ adapters: logAdapters, key, name: 'log provider' })
