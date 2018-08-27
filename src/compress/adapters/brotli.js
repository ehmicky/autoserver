'use strict'

const {
  compress: brotliCompress,
  decompress: brotliDecompress,
} = require('iltorb')

// Compress to Brotli
const compress = function (content) {
  return brotliCompress(content)
}

// Decompress from Brotli
const decompress = function (content) {
  return brotliDecompress(content)
}

module.exports = {
  name: 'br',
  title: 'Brotli',
  compress,
  decompress,
}
