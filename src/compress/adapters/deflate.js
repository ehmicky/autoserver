'use strict'

const zlib = require('zlib')
const { promisify } = require('util')

const pDeflate = promisify(zlib.deflate)
const pInflate = promisify(zlib.inflate)

// Compress to Deflate
const compress = function(content) {
  return pDeflate(content)
}

// Decompress from Deflate
const decompress = function(content) {
  return pInflate(content)
}

const deflate = {
  name: 'deflate',
  title: 'Deflate',
  compress,
  decompress,
}

module.exports = {
  deflate,
}
