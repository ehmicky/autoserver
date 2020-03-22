import { brotliCompress, brotliDecompress } from 'zlib'
import { promisify } from 'util'

// Compress to Brotli
const compress = function (content) {
  const pBrotliCompress = promisify(brotliCompress)
  return pBrotliCompress(content)
}

// Decompress from Brotli
const decompress = function (content) {
  const pBrotliDecompress = promisify(brotliDecompress)
  return pBrotliDecompress(content)
}

export const brotli = {
  name: 'br',
  title: 'Brotli',
  compress,
  decompress,
}
