import { promisify } from 'node:util'
import { gzip as zlibGzip, gunzip as zlibGunzip } from 'node:zlib'

const pGzip = promisify(zlibGzip)
const pGunzip = promisify(zlibGunzip)

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
