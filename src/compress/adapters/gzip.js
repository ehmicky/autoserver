import { promisify } from 'node:util'
import { gunzip as zlibGunzip, gzip as zlibGzip } from 'node:zlib'

const pGzip = promisify(zlibGzip)
const pGunzip = promisify(zlibGunzip)

// Compress to Gzip
const compress = (content) => pGzip(content)

// Decompress from Gzip
const decompress = (content) => pGunzip(content)

export const gzip = {
  name: 'gzip',
  title: 'Gzip',
  compress,
  decompress,
}
