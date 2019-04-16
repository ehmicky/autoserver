const zlib = require('zlib')
const { promisify } = require('util')

const pGzip = promisify(zlib.gzip)
const pGunzip = promisify(zlib.gunzip)

// Compress to Gzip
const compress = function(content) {
  return pGzip(content)
}

// Decompress from Gzip
const decompress = function(content) {
  return pGunzip(content)
}

const gzip = {
  name: 'gzip',
  title: 'Gzip',
  compress,
  decompress,
}

module.exports = {
  gzip,
}
