import { promisify } from 'util'
import zlib from 'zlib'

const pGzip = promisify(zlib.gzip)
const pGunzip = promisify(zlib.gunzip)

// Compress to Gzip
const compress = function (content) {
  return pGzip(content)
}

// Decompress from Gzip
const decompress = function (content) {
  return pGunzip(content)
}

export const gzip = {
  name: 'gzip',
  title: 'Gzip',
  compress,
  decompress,
}
