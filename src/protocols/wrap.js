const { wrapAdapters } = require('../adapters/wrap.js')

const { PROTOCOL_ADAPTERS } = require('./adapters/main.js')
const { start } = require('./start')

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
