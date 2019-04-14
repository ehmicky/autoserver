'use strict'

const { brotli } = require('./brotli')
const { deflate } = require('./deflate')
const { gzip } = require('./gzip')
const { identity } = require('./identity')

// Order matters, as first ones will have priority
const COMPRESS_ADAPTERS = [
  ...(brotli.supported ? [brotli] : []),
  deflate,
  gzip,
  identity,
]

module.exports = {
  COMPRESS_ADAPTERS,
}
