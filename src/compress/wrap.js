import { wrapAdapters } from '../adapters/wrap.js'

import { COMPRESS_ADAPTERS } from './adapters/main.js'

const members = ['name', 'title', 'decompress', 'compress']

const compressAdapters = wrapAdapters({
  adapters: COMPRESS_ADAPTERS,
  members,
  reason: 'COMPRESS',
})

module.exports = {
  compressAdapters,
}
