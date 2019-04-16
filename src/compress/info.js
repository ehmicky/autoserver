const compressible = require('compressible')

const { getNames } = require('../adapters/get.js')

const { COMPRESS_ADAPTERS } = require('./adapters/main.js')

const ALGOS = getNames(COMPRESS_ADAPTERS)

// Do not try to compress binary content types
const shouldCompress = function({ contentType }) {
  return compressible(contentType)
}

module.exports = {
  ALGOS,
  shouldCompress,
}
