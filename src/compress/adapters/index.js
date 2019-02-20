'use strict'

const brotli = require('./brotli')

// Order matters, as first ones will have priority
module.exports = [
  ...(brotli.supported ? [brotli] : []),
  require('./deflate'),
  require('./gzip'),
  require('./identity'),
]
