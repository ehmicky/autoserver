import { wrapAdapters } from '../adapters/wrap.js'

import { LOG_ADAPTERS } from './adapters/main.js'

const members = ['name', 'title', 'report', 'reportPerf', 'getOpts']

export const logAdapters = wrapAdapters({
  adapters: LOG_ADAPTERS,
  members,
  reason: 'LOG',
})
