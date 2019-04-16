import { wrapAdapters } from '../adapters/wrap.js'

import { PROTOCOL_ADAPTERS } from './adapters/main.js'
import { start } from './start.js'

const members = ['name', 'title']

const methods = {
  startServer: start,
}

const protocolAdapters = wrapAdapters({
  adapters: PROTOCOL_ADAPTERS,
  members,
  methods,
  reason: 'PROTOCOL',
})

module.exports = {
  protocolAdapters,
}
