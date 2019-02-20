'use strict'

const { brotliCompress, brotliDecompress } = require('zlib')
const { promisify } = require('util')

// Compress to Brotli
const compress = function(content) {
  const pBrotliCompress = promisify(brotliCompress)
  return pBrotliCompress(content)
}

// Decompress from Brotli
const decompress = function(content) {
  const pBrotliDecompress = promisify(brotliDecompress)
  return pBrotliDecompress(content)
}

const supported = brotliCompress !== undefined

module.exports = {
  name: 'br',
  title: 'Brotli',
  compress,
  decompress,
  supported,
}
