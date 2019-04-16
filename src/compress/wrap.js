const { wrapAdapters } = require('../adapters/wrap.js')

const { COMPRESS_ADAPTERS } = require('./adapters/main.js')

const members = ['name', 'title', 'decompress', 'compress']

const compressAdapters = wrapAdapters({
  adapters: COMPRESS_ADAPTERS,
  members,
  reason: 'COMPRESS',
})

module.exports = {
  compressAdapters,
}
