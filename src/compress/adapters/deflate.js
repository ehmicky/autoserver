'use strict'

const { deflate, inflate } = require('zlib')

const promisify = require('util.promisify')

const pDeflate = promisify(deflate)
const pInflate = promisify(inflate)

// Compress to Deflate
const compress = function(content) {
  return pDeflate(content)
}

// Decompress from Deflate
const decompress = function(content) {
  return pInflate(content)
}

module.exports = {
  name: 'deflate',
  title: 'Deflate',
  compress,
  decompress,
}
